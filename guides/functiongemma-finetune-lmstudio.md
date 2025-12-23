# FunctionGemma Fine-Tuning + Local Serving (LM Studio)

## Intent
Provide a beginner-friendly, step-by-step tutorial to fine-tune **FunctionGemma (270M)** with Unsloth, export the model to **GGUF**, and run it locally in **LM Studio** for tool/function calling.

## Why this matters
Function calling lets you reliably trigger tools with structured arguments, and FunctionGemma is small enough to run locally. This workflow shows how to fine-tune a specialized router model, convert it for local use, and serve it via an OpenAI-compatible API.

## What you’ll build
- A fine-tuned FunctionGemma checkpoint for custom tool calls.
- A GGUF export optimized for local inference in LM Studio.
- A local server endpoint you can call from your own code.

## Prerequisites
- A Google account to run the Colab notebook.
- A GPU-backed Colab runtime (recommended for faster training).
- LM Studio installed locally.
- A small, task-focused dataset (JSONL works best for tool-call examples).

## Step 1: Open the official Colab notebook
1. Open the FunctionGemma + LM Studio notebook.
2. Click **File → Save a copy in Drive**.
3. Switch the runtime to **GPU**.

## Step 2: Run the setup cells
The notebook installs Unsloth plus training dependencies (Transformers/TRL, bitsandbytes, etc.) and prepares the environment. Run these cells in order until the model loads successfully.

## Step 3: Prepare your tool-call dataset
Create a small dataset that mirrors real tool calls. A JSONL format works well:

```json
{"instruction":"Find flights from Vienna to Berlin on Friday","tools":[{"name":"search_flights","description":"Search available flights","parameters":{"type":"object","properties":{"origin":{"type":"string"},"destination":{"type":"string"},"date":{"type":"string"}},"required":["origin","destination","date"]}}],"output":{"name":"search_flights","arguments":{"origin":"VIE","destination":"BER","date":"2025-07-18"}}}
```

Keep examples short and consistent. The notebook shows how to load and format the dataset for supervised fine-tuning.

## Step 4: Configure the fine-tuning run
In the notebook, confirm:
- The **FunctionGemma (270M)** base model selection.
- The **LoRA/QLoRA** configuration (rank, target modules, etc.).
- Training parameters (batch size, steps/epochs, max sequence length).

Use a small validation split if possible to sanity-check outputs.

## Step 5: Train and sanity-check outputs
Run the training cell and monitor loss. After training:
- Try a few tool-call prompts.
- Check that the model emits valid tool names and argument shapes.

### OUTPUT FORMAT (tool call)
```json
{
  "name": "search_flights",
  "arguments": {
    "origin": "VIE",
    "destination": "BER",
    "date": "2025-07-18"
  }
}
```

If the model drifts, add more examples for the failing tool or tighten the prompt template used in the notebook.

## Step 6: Export to GGUF (LM Studio-ready)
The notebook includes a conversion step to **GGUF**. Use the provided export cell and pick a quantization that fits your machine (for example, a smaller 4-bit quant for laptops or a larger 8-bit quant for higher quality).

You should end up with a GGUF file or folder containing GGUF artifacts.

## Step 7: Import the model into LM Studio
1. Open LM Studio.
2. Click **Import** → **Local model**.
3. Select the GGUF output path.
4. Start a chat session to validate the tool-call behavior.

## Step 8: Serve it locally and call it from code
LM Studio can serve your model through an OpenAI-compatible endpoint.

**Example cURL request**
```bash
curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "functiongemma-270m-gguf",
    "messages": [
      {"role": "system", "content": "Return tool calls only."},
      {"role": "user", "content": "Find flights from Vienna to Berlin on Friday."}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_flights",
          "description": "Search available flights",
          "parameters": {
            "type": "object",
            "properties": {
              "origin": {"type": "string"},
              "destination": {"type": "string"},
              "date": {"type": "string"}
            },
            "required": ["origin", "destination", "date"]
          }
        }
      }
    ]
  }'
```

**Example Python call**
```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")

response = client.chat.completions.create(
    model="functiongemma-270m-gguf",
    messages=[
        {"role": "system", "content": "Return tool calls only."},
        {"role": "user", "content": "Find flights from Vienna to Berlin on Friday."},
    ],
    tools=[
        {
            "type": "function",
            "function": {
                "name": "search_flights",
                "description": "Search available flights",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "origin": {"type": "string"},
                        "destination": {"type": "string"},
                        "date": {"type": "string"},
                    },
                    "required": ["origin", "destination", "date"],
                },
            },
        }
    ],
)

print(response.choices[0].message)
```

## Tips for better tool-calling quality
- Keep each tool name and argument schema stable across examples.
- Use consistent natural-language prompts that mirror production requests.
- Prefer concise, well-labeled tool arguments.
- Add 10–20 extra examples for any tool that fails in practice.

## Troubleshooting
- **Model ignores tools** → Add more demonstrations and tighten system prompts.
- **Arguments missing or malformed** → Add examples with the exact JSON shape.
- **LM Studio import fails** → Re-export GGUF with a smaller quantization or shorter context length.

## Related resources
- [Best model providers for AI agents for 2026](models-for-ai-agents-2026.md)
- [Model Context Protocol (MCP) guide](mcp-guide.md)

## References
- https://lmstudio.ai/blog/functiongemma-unsloth
- https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/FunctionGemma_(270M)-LMStudio.ipynb
