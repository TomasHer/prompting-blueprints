# Ornith-1.0: Run an Open-Source Agentic Coding LLM on a DGX Spark

## Intent
Provide a practical guide to **Ornith-1.0**, a new family of open-source, MIT-licensed LLMs built specifically for **agentic coding**, and show how to run the mid-size variant locally on an **NVIDIA DGX Spark**. The headline use case: a local model that codes well, runs 24/7 on a desk-side box, and loops over your repository to find and fix bugs without sending your code to a cloud API.

## Why this matters
Most frontier coding models are closed and cloud-hosted. Ornith-1.0 is open-weight and small enough that its **35B Mixture-of-Experts (MoE)** variant fits in the **128 GB unified memory of a DGX Spark** — no 200 GB+ server required. That unlocks a new workflow pattern: cheap, private, always-on local agents that loop through your codebase hourly, write security reports with fixes, and review your open PRs. Practitioners running it report it being competitive with — and faster than — larger models on coding tasks, while staying entirely on local hardware.

## What you'll learn
- The Ornith-1.0 model family, its training approach, and benchmark results.
- Why the 35B MoE variant is the sweet spot for a DGX Spark.
- How to download and serve Ornith-1.0 locally with an OpenAI-compatible endpoint.
- How to wire it into an agentic loop (e.g., an hourly security-scan + fix loop).

## Prerequisites
- **Hardware**: An NVIDIA DGX Spark (GB10 Grace Blackwell, 128 GB unified LPDDR5x memory) for the 35B MoE variant. The 9B/31B dense models run on a single workstation GPU; the 397B MoE needs a multi-GPU server.
- **Software**: Recent NVIDIA driver/CUDA stack, Docker, Python 3.10+, and familiarity with an LLM serving engine (vLLM, SGLang, or Ollama).
- **Accounts**: A Hugging Face account to pull the weights.

## Step 1: Understand the Model Family
Ornith-1.0 is a family of open-source LLMs specialized for agentic coding, spanning four sizes:

| Variant | Type | Best for |
| --- | --- | --- |
| **Ornith-1.0 9B** | Dense | Laptops / single small GPU, lightweight assistants |
| **Ornith-1.0 31B** | Dense | Single workstation GPU |
| **Ornith-1.0 35B** | MoE | **DGX Spark (128 GB unified memory)** — the focus of this guide |
| **Ornith-1.0 397B** | MoE | Multi-GPU servers, frontier-level performance |

Key facts:
- **License**: MIT (fully open for commercial use).
- **Base models**: Post-trained on top of `gemma4` and `qwen3.5`.
- **Training method**: A **self-improving training strategy** in which reinforcement learning generates not only solution rollouts but also the **task-specific scaffolds** that drive those rollouts. By jointly optimizing the scaffold *and* the resulting solution, the model produces higher-quality solutions for agentic coding.

## Step 2: Why the 35B MoE Fits a DGX Spark
A Mixture-of-Experts model has many parameters but activates only a fraction per token, so it delivers strong quality at a much lower memory and compute cost than a dense model of equal total size. The **35B MoE** variant is the practical target for a DGX Spark because:

- It fits comfortably within the Spark's **128 GB unified memory** (with room for KV cache and context), unlike models that demand 200 GB+ of RAM.
- MoE sparsity keeps **tokens/sec high**, so an always-on loop stays responsive.
- It is reported to be **smarter and faster than comparable-size open models** on coding tasks while running locally.

> Rule of thumb: at ~4-bit quantization a 35B MoE needs roughly 20–25 GB for weights, leaving ample headroom on the Spark for long-context agentic sessions.

## Step 3: Download the Weights
Pull the 35B MoE variant from the Ornith-1.0 Hugging Face collection:

```bash
pip install -U "huggingface_hub[cli]"

# Replace with the exact repo id from the collection page
hf download deepreinforce-ai/Ornith-1.0-35B-MoE \
  --local-dir ./Ornith-1.0-35B-MoE
```

## Step 4: Serve Ornith-1.0 Locally
Serve the model behind an OpenAI-compatible API so any agent framework can talk to it.

### Option A: Ollama (simplest on a DGX Spark)
```bash
# If the collection ships a GGUF, this is the fastest path
ollama run ornith-1.0:35b
```
This exposes an OpenAI-compatible endpoint at `http://localhost:11434/v1`.

### Option B: vLLM (best throughput for loops)
```bash
docker pull vllm/vllm-openai:latest

vllm serve ./Ornith-1.0-35B-MoE \
  --gpu-memory-utilization 0.85 \
  --max-model-len 32768 \
  --served-model-name ornith-1.0-35b
```

### Option C: SGLang
```bash
python3 -m sglang.launch_server \
  --model-path ./Ornith-1.0-35B-MoE \
  --mem-fraction-static 0.85 \
  --served-model-name ornith-1.0-35b
```

Verify the endpoint:
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ornith-1.0-35b",
    "messages": [{"role": "user", "content": "Write a Python function to detect SQL injection in a query string."}]
  }'
```

## Step 5: Build an Always-On Agentic Loop
The standout pattern for a local model is a **24/7 loop** over your own codebase. A common setup:

1. **Hourly security scan** — point an agent (Codex CLI, Claude Code with a local provider, or a custom script) at the local endpoint and loop it over different parts of the repo. For each pass it scans for security vulnerabilities and, for anything it finds, **writes a report containing the proposed fix**.
2. **Daily verify-and-fix loop** — a second loop reads that report, **verifies** each finding against the code, and applies fixes.
3. **Daily PR review** — a third loop walks all open pull requests and leaves review notes.

Minimal scheduler sketch:
```bash
# /etc/cron.d/ornith-loops  — runs against the local Ornith endpoint
0 * * * *  user  /opt/agents/security-scan.sh   >> /var/log/ornith-scan.log 2>&1
30 3 * * * user  /opt/agents/verify-and-fix.sh   >> /var/log/ornith-fix.log 2>&1
0 4 * * *  user  /opt/agents/review-open-prs.sh  >> /var/log/ornith-pr.log 2>&1
```

Each script just sends prompts to `http://localhost:8000/v1` (or the Ollama port) and writes Markdown reports into the repo. Because inference is local, you can run these as often as you like at no per-token cost and without exposing source code to a third party.

## Step 6: Benchmark Context
Per the model release, Ornith-1.0 achieves state-of-the-art results among open-source models of comparable size on coding benchmarks:

| Benchmark | Score |
| --- | --- |
| Terminal-Bench 2.1 | **77.5** |
| SWE-Bench Verified | **82.4** |
| SWE-Bench Pro | **62.2** |
| SWE-Bench Multilingual | **78.9** |
| NL2Repo | **48.2** |
| SWE Atlas — QnA | **41.2** |
| SWE Atlas — RF | **42.6** |
| SWE Atlas — TW | **39.1** |
| ClawEval | **77.1** |

> In the published evaluation chart, the flagship **Ornith-1.0-397B** is compared against models such as Qwen3.5-397B, Qwen3.7-Max, GLM-5.2-744B, Minimax-M3-428B, DeepSeek-V4-Pro-1.6T, and Claude Opus 4.7/4.8, leading or matching the field on Terminal-Bench, SWE-bench Pro, SWE-bench Multilingual, and Claw-eval Avg.

## Takeaways
- Ornith-1.0 is an **MIT-licensed, open-weight** family purpose-built for agentic coding.
- The **35B MoE** variant is the practical pick for a **DGX Spark**: strong coding quality without 200 GB+ of RAM.
- Serve it behind an OpenAI-compatible API and run **scheduled, local 24/7 loops** for security scanning, fixes, and PR review — private, cheap, and always on.

## References
- [Ornith-1.0 Tech Blog (deep-reinforce.com)](https://deep-reinforce.com/ornith_1_0.html)
- [Ornith-1.0 Hugging Face Collection](https://huggingface.co/collections/deepreinforce-ai/ornith-10)
- [NVIDIA DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
