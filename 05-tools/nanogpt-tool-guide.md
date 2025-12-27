# nanoGPT + nanochat Tool Guide

## Intent
- Use this guide when you want a **minimal, hackable GPT training stack** that you can inspect end-to-end, or when you want to reproduce the **nanochat speedrun**: a simple ChatGPT-style clone with a web UI.
- Based on Andrej Karpathy’s **nanoGPT** repository and the **nanochat** introduction/discussion. Both projects prioritize readability (~8k LOC), low dependency overhead, and transparent training/inference flows.

## Why nanoGPT matters
- **Full-stack transparency:** Training loop, tokenizer setup, data preprocessing, checkpointing, and sampling are all in plain Python/PyTorch.
- **Reasonable cost to a “ChatGPT-like” clone:** The nanochat speedrun trains a ~1.9B parameter model on ~38B tokens in ~4 hours on a single 8xH100 node (~$100), producing a small model you can converse with (stories, poems, simple Q&A).
- **Fast iteration:** Configs are simple Python files; data prep scripts live next to datasets so you can swap in custom corpora quickly.
- **Great for teaching and audits:** Everything is in one repo with straightforward defaults—ideal for workshops and controlled experiments.

## Quick orientation
- **Configs:** `config/*.py` define model size, context length, optimizer, LR schedules, and dataset paths.
- **Data prep:** `data/<dataset>/prepare.py` scripts tokenize text and emit `train.bin` / `val.bin`.
- **Training:** `train.py` consumes a config and writes checkpoints + logs to `out/<run-name>`.
- **Sampling:** `sample.py` generates text from a checkpoint and a start prompt.
- **nanochat speedrun:** A single `speedrun.sh` script (in the nanochat repo) that handles data download → training → serving a lightweight web chat UI.

## Setup
1) **Environment**
- Python 3.10+ and PyTorch with CUDA if you have GPUs.
- Clone the repo and install deps: `pip install -r requirements.txt`.

2) **Hardware notes**
- nanoGPT scales up to multi-GPU; start on a single GPU to validate the pipeline.
- For CPU-only demos, reduce model size and context length in the config to keep runtimes manageable.

## Minimal workflow (nanoGPT)

### 1) Prepare data
```bash
cd data/shakespeare
python prepare.py  # emits train.bin / val.bin under data/shakespeare
```
- Swap `shakespeare` for your own folder with a `prepare.py` that builds `train.bin` / `val.bin`.
- Keep train/val splits deterministic so perplexity comparisons stay meaningful.

### 2) Train a small baseline
```bash
python train.py config/train_shakespeare_char.py \
  --out_dir=out-shakespeare-char \
  --device=cuda \
  --compile=True \
  --eval_interval=200 \
  --log_interval=10
```
- Tweak `block_size`, `batch_size`, and `n_layer` in the config to match your VRAM.
- Use `--compile=False` on older GPUs or when debugging.
- Checkpoints land in `out-shakespeare-char`; the latest is typically `ckpt.pt`.

### 3) Scale or fine-tune
- Start from a base config (e.g., GPT-2 sized) and set:
  - `dataset` path to your tokenized corpus.
  - `gradient_accumulation_steps` for fitting large batches on limited VRAM.
  - `max_iters` / `lr_decay_iters` for longer runs.
- For multi-GPU, use `torchrun --nproc_per_node=<gpus> train.py config/<config>.py ...`.

### 4) Sample/infer
```bash
python sample.py \
  --out_dir=out-shakespeare-char \
  --start="Once upon a time" \
  --num_samples=3 \
  --max_new_tokens=120 \
  --temperature=0.8 \
  --top_k=50
```
- Lower `temperature` for factual tasks; raise it for creative outputs.
- Save exemplar generations as regression fixtures to detect quality drift.

### Copy-ready response format (for downstream agents)
Use this as a system/user prompt when sampling so outputs stay structured:
```text
System: You are a concise assistant. When asked, respond in Markdown with a heading, 3–5 bullets, and a short closing line.
User: Summarize the plot of Hamlet in under 120 words.
```

## nanochat speedrun (ChatGPT-style clone)
- The nanochat repo contains a single `speedrun.sh` that automates the full pipeline.
- What it does: downloads an open dataset, trains a ~1.9B parameter model on ~38B tokens, and serves a simple web chat UI.
- Expected footprint: ~4 hours on a single 8xH100 GPU node (~$100) as reported by the author; adjust expectations downward if you use fewer/smaller GPUs.
- How to use:
  1. Ensure CUDA + PyTorch are installed and GPUs are visible (`nvidia-smi`).
  2. Run `bash speedrun.sh` (optionally adjust env vars inside for dataset location or run name).
  3. When training finishes, launch the provided web UI script (typically called from within `speedrun.sh`) and open the local URL to chat.
- Tweak points:
  - Swap the dataset by editing the download/preprocess section in `speedrun.sh`.
  - Reduce `n_layer`, `n_head`, or context length if you need a cheaper run.
  - Add a system prompt in the UI layer for safety/tone.

## Guardrails & quality tips
- **Reproducibility:** Set seeds in configs; log git commit + config diff per run.
- **Data hygiene:** Deduplicate and filter profanity/PII in your corpus before tokenization.
- **Eval fast:** Keep a small, fixed validation set and monitor perplexity every N steps.
- **Checkpoint hygiene:** Retain at least the best-val checkpoint and the latest checkpoint; delete intermediates to save disk.
- **Serving:** For lightweight demos, use FP16; for correctness-sensitive tasks, enable FP32 evaluation on a smaller batch.

## References
- nanoGPT repository: <https://github.com/karpathy/nanoGPT>
- nanochat introduction/discussion: <https://github.com/karpathy/nanochat/discussions/1>
