# GLM-5: The Agentic Foundation Model

## Intent
Provide a comprehensive technical guide to **GLM-5**, the latest open-source model designed specifically for complex systems engineering and long-horizon agentic tasks. This guide covers model architecture, local serving with vLLM/SGLang, and integration with agent frameworks like OpenClaw.

## Why this matters
GLM-5 represents a significant shift from "vibe coding" to rigorous "agentic engineering." With 744B parameters (40B active) and a Mixture-of-Experts (MoE) architecture, it achieves state-of-the-art performance on agentic benchmarks, closing the gap with frontier closed models. For AI engineers, its open weights and optimized tool-calling capabilities make it a critical asset for building autonomous systems.

## What you’ll learn
-Key technical specifications of GLM-5.
- How to set up the environment and dependencies.
- How to serve the model locally using vLLM or SGLang.
- How to integrate GLM-5 with OpenClaw for personal assistant workflows.

## Prerequisites
- **Hardware**: Significant GPU resources (e.g., NVIDIA Hopper/Blackwell) for local inference due to model size (744B parameters), or access to an API provider.
- **Software**: Docker, Python 3.10+, and familiarity with LLM serving frameworks.

## Step 1: Understand the Model Specs
GLM-5 is built for scale and efficiency:
- **Parameters**: 744B Total / 40B Active (MoE).
- **Context**: Integrates DeepSeek Sparse Attention (DSA) to preserve long-context capacity while reducing costs.
- **Training**: Pre-trained on 28.5T tokens; Post-trained using libraries like `slime` for efficient RLHF.
- **Capabilities**: Best-in-class open-source performance on reasoning, coding, and agentic tasks.

## Step 2: Prepare the Environment
To work with GLM-5 from the source or for fine-tuning, you need the specific dependencies listed in the repository.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/zai-org/GLM-5.git
    cd GLM-5
    ```

2.  **Install Dependencies**:
    The core requirements include the latest Transformers (often from source for new model support), `accelerate`, and `pre-commit`.
    ```bash
    pip install git+https://github.com/huggingface/transformers.git
    pip install accelerate>=1.10.1 pre-commit>=4.2.0
    ```

## Step 3: Serve GLM-5 Locally
You can serve GLM-5 using high-performance engines like **vLLM** or **SGLang**. This provides an OpenAI-compatible API for your agents.

### Option A: Using vLLM
vLLM is recommended for its ease of use and broad hardware support.

**Docker Command**:
```bash
docker pull vllm/vllm-openai:nightly

vllm serve zai-org/GLM-5-FP8 \
     --tensor-parallel-size 8 \
     --gpu-memory-utilization 0.85 \
     --speculative-config.method mtp \
     --speculative-config.num_speculative_tokens 1 \
     --tool-call-parser glm47 \
     --reasoning-parser glm45 \
     --enable-auto-tool-choice \
     --served-model-name glm-5-fp8
```

### Option B: Using SGLang
SGLang offers advanced optimizations like RadixAttention.

**Docker Command**:
```bash
docker pull lmsysorg/sglang:glm5-hopper # For Hopper GPU

python3 -m sglang.launch_server \
  --model-path zai-org/GLM-5-FP8 \
  --tp-size 8 \
  --tool-call-parser glm47  \
  --reasoning-parser glm45 \
  --speculative-algorithm EAGLE \
  --speculative-num-steps 3 \
  --speculative-eagle-topk 1 \
  --speculative-num-draft-tokens 4 \
  --mem-fraction-static 0.85 \
  --served-model-name glm-5-fp8
```

## Step 4: Integrate with Agent Frameworks (OpenClaw)
GLM-5 is designed to power agents. A prime example is its integration with **OpenClaw**, an open-source framework that turns the model into a personal assistant capable of operating across apps.

### Installation
Install OpenClaw via your terminal:

**Linux/macOS**:
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell)**:
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### Configuration
Run the onboarding wizard to connect OpenClaw to GLM-5 (via Z.AI or your local endpoint).

```bash
openclaw onboard --install-daemon
```

**During the interactive setup:**
1.  **Risk Confirmation**: Select `Yes` to acknowledge agentic capabilities.
2.  **Mode**: Select `Quick Start`.
3.  **Provider**: Select `Z.AI` (or Custom if serving locally).

## Step 5: Advanced Usage - Coding Plan
For developers using GLM-5 for coding assistance (e.g., in Claude Code or similar tools):

- **Config Update**: Simply update your model configuration string to `"GLM-5"`.
- **Note**: GLM-5 is a larger model and may consume more quota/resources than GLM-4.7. It is optimized to handle complex, multi-step refactoring tasks that smaller models might struggle with.

## Related resources
- [GLM-5 GitHub Repository](https://github.com/zai-org/GLM-5)
- [Hugging Face Model Card](https://huggingface.co/zai-org/GLM-5)
- [Z.AI Blog Announcement](https://z.ai/blog/glm-5)
