# Fine-Tune an Open Source LLM with Claude

## Intent
Teach you how to fine-tune a small open-source LLM with Claude as your planning and automation copilot, following the Hugging Face Skills training example.

## Scenario recap (from the skill)
- Task: fine-tune **Qwen3-0.6B** on **OpenR1/codeforces-cot** and beat the base model on **HumanEval**.
- Constraints: max 5 jobs; use Claude to reason through the skill before burning GPU time.

## Prerequisites
- Claude with long-context access (Claude 3.5/4.x) for planning and file digestion.
- Hugging Face account, `huggingface_hub` token, and a GPU workspace (A10/A100 preferred).
- Python 3.10+, `pip install datasets transformers trl accelerate bitsandbytes peft evaluate`.
- Git LFS installed; optional: Weights & Biases for run tracking.

## Quick workflow
1. **Digest the skill**: paste the Hugging Face blog/skill into Claude and ask for a run checklist.
2. **Prep data**: load `OpenR1/codeforces-cot`, trim long examples, and format for supervised fine-tuning.
3. **Configure LoRA**: point to `Qwen/Qwen3-0.6B`, set max seq length (2k–4k), batch size that fits GPU, and learning rate ~2e-4.
4. **Train**: run TRL `SFTTrainer` or `trl.quickstart` with gradient accumulation to stay within VRAM.
5. **Evaluate**: run HumanEval (e.g., `evalplus`) on base vs. fine-tuned checkpoints; keep the best.
6. **Package**: push the adapter + merged weights to the Hub and log a short eval report.

## Step 1: Have Claude plan the runs
Share this starter prompt with Claude so it front-loads reasoning instead of burning jobs:

```
You are my fine-tuning copilot. Goal: beat the Qwen3-0.6B base score on HumanEval by fine-tuning on OpenR1/codeforces-cot with at most 5 jobs. 
Tasks: draft a training plan (LoRA config, seq length, steps, eval cadence), predict VRAM/step time for A10 vs A100, and list 3 risk checks before launching a job. Return a numbered checklist I can execute in bash/notebooks.
```

Ask Claude to summarize the skill, surface hyperparameter defaults, and note any red flags before the first run.

## Step 2: Prepare the dataset
```python
from datasets import load_dataset

ds = load_dataset("OpenR1/codeforces-cot")

# Drop overly long samples to stay within context
max_tokens = 1800
def filter_len(example):
    return len(example["solution"].split()) < max_tokens

ds = ds.filter(filter_len)

# Reformat for SFTTrainer
train_ds = ds["train"].map(
    lambda ex: {
        "messages": [
            {"role": "user", "content": ex["problem"]},
            {"role": "assistant", "content": ex["solution"]},
        ]
    }
)
```
Keep a small validation split (e.g., 2–5%) for quick sanity checks.

## Step 3: Configure training (LoRA on Qwen3-0.6B)
```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig
from peft import LoraConfig

model_id = "Qwen/Qwen3-0.6B"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto", torch_dtype="auto")

lora = LoraConfig(r=32, lora_alpha=16, target_modules=["q_proj","v_proj"], lora_dropout=0.05)

config = SFTConfig(
    model=model_id,
    dataset_text_field=None,
    max_seq_length=2048,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    num_train_epochs=2,
    logging_steps=10,
    save_strategy="steps",
    save_steps=200,
    eval_strategy="steps",
    eval_steps=200,
)

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_ds,
    dataset_text_field=None,
    args=config,
    peft_config=lora,
)

trainer.train()
trainer.save_model("qwen3-0.6b-cf-cot-lora")
```
Adjust `per_device_train_batch_size` and `gradient_accumulation_steps` based on GPU memory; Claude can estimate fit.

## Step 4: Evaluate on HumanEval
- Install `evalplus`: `pip install evalplus`.
- Generate samples from base and fine-tuned models (temperature 0.2–0.3, top_p 0.9).
- Run: `evalplus.humaneval --model local:qwen3-0.6b-cf-cot-lora --limit 164`.
- Track pass@1; keep checkpoints that beat the base. Claude can help draft a comparison table and pick the best adapter.

## Step 5: Merge, push, and share
```bash
# Merge LoRA + base
python - <<'PY'
from peft import AutoPeftModelForCausalLM
from transformers import AutoTokenizer
model = AutoPeftModelForCausalLM.from_pretrained("qwen3-0.6b-cf-cot-lora", device_map="cpu")
model = model.merge_and_unload()
model.save_pretrained("qwen3-0.6b-cf-cot-merged")
AutoTokenizer.from_pretrained("Qwen/Qwen3-0.6B").save_pretrained("qwen3-0.6b-cf-cot-merged")
PY

# Push to the Hub
huggingface-cli upload <your-username>/qwen3-0.6b-cf-cot qwen3-0.6b-cf-cot-merged
```
Add a README with the training recipe, eval numbers, and inference params (temperature/top_p/stop sequences).

## Claude tips that helped in the skill run
- Spend tokens up front: have Claude ingest the full skill, draft 2–3 hyperparameter options, and predict VRAM/time before starting jobs.
- Ask for failure modes after each run: “why might the loss curve look noisy?”, “what would you change for the next job?”.
- Keep prompts short during training/evals to maximize context for logs, configs, and diff patches.

## Troubleshooting
- **CUDA OOM**: lower `per_device_train_batch_size`, increase accumulation, or reduce `max_seq_length`.
- **Slow convergence**: increase epochs slightly or raise learning rate to 3e-4; ensure dataset is filtered for length.
- **Eval regressions**: re-run on a fixed seed, and verify decoding params are identical for base vs. fine-tuned models.

## References
- Hugging Face — [HF Skills: training a fine-tuning agent with Claude Code](https://huggingface.co/blog/hf-skills-training)
