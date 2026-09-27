---
title: "Opilot + DGX Spark: Local LLMs in VS Code Copilot Chat"
tags: ["tools", "ollama", "vscode"]
last_updated: 2026-09-27
---

# Opilot + DGX Spark: Local LLMs in VS Code Copilot Chat

## Intent
- Walk a non-expert through running open models (Qwen, Llama, DeepSeek) on an **NVIDIA DGX Spark** and using them from **GitHub Copilot Chat** in VS Code on a **separate laptop**.
- Use the free, MIT-licensed [Opilot](https://github.com/selfagency/opilot) extension (publisher: The Self Agency) as the bridge.

## Use when
- You own a DGX Spark and want your code and prompts to stay on your own hardware.
- You code on a laptop and don't want to sit at the Spark itself.

## How it fits together

```
 Laptop                                        DGX Spark
 VS Code + Copilot Chat + Opilot  ─── home network ───▶  Ollama (runs the models)
                                  http://<spark-ip>:11434
```

- **Ollama** is the program on the Spark that downloads and runs the models.
- **Opilot** is a VS Code extension on the laptop. It adds the Spark's models to the model picker in Copilot Chat.
- The two talk over your home network on port `11434`.

## Before you start
- The DGX Spark is set up, switched on, and on the **same Wi-Fi or router** as your laptop.
- VS Code on the laptop, version **1.111 or newer** (Help → Check for Updates).
- A free GitHub account. Copilot Free is enough.
- About 30–45 minutes. Most of it is waiting for model downloads.

> **Safety note.** Ollama has no password. These steps let any device on your network use it. That's fine at home. Do not do this on public, hotel, or office Wi-Fi without asking IT. See [Safer option: SSH tunnel](#safer-option-ssh-tunnel).

## Part A: on the DGX Spark

### Step 1: Open a terminal on the Spark
- **Monitor and keyboard attached:** open the **Terminal** app.
- **No monitor:** on the laptop, open the **NVIDIA Sync** app and choose **Terminal**. Or run `ssh <your-spark-username>@<spark-ip>` in a laptop terminal.

### Step 2: Make sure Ollama is installed
```bash
ollama --version
```
If you see a version number, go to Step 3. If you see "command not found", install it:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 3: Download two models
```bash
ollama pull qwen3-coder:30b
ollama pull qwen2.5-coder:3b
```
- `qwen3-coder:30b` (about 19 GB) is the main chat and coding model. The Spark's 128 GB of memory handles it easily.
- `qwen2.5-coder:3b` (about 2 GB) is small and fast. It is used for autocomplete while you type.

Quick test (type `/bye` to exit):
```bash
ollama run qwen2.5-coder:3b "Say hello in one sentence"
```

### Step 4: Let the laptop reach Ollama
By default Ollama only answers the Spark itself. Paste these four lines one at a time. Enter your Spark password if asked:
```bash
sudo mkdir -p /etc/systemd/system/ollama.service.d
printf '[Service]\nEnvironment="OLLAMA_HOST=0.0.0.0:11434"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl restart ollama
```
Then check the firewall:
```bash
sudo ufw status
```
If it says `Status: active`, run `sudo ufw allow 11434/tcp`. If it says `inactive`, do nothing.

### Step 5: Write down the Spark's address
```bash
hostname -I
```
Note the first number, for example `192.168.1.50`. You need it in Part B.

> **Tip:** Your router may give the Spark a new address after a restart. In your router's settings, look for "DHCP reservation" or "static IP" so the address stays fixed.

## Part B: on your laptop

### Step 6: Test the connection in a browser
Open `http://192.168.1.50:11434` (use your own address). You should see the text **Ollama is running**. If not, see [Troubleshooting](#troubleshooting).

### Step 7: Set up Copilot Chat
1. In VS Code, click the **Extensions** icon (four squares) in the left sidebar.
2. Search for **GitHub Copilot Chat** and click **Install**.
3. Sign in with your GitHub account when asked.

### Step 8: Install Opilot
1. In Extensions, search for **Opilot**.
2. Pick the one by **The Self Agency** (description starts "Run Ollama models with full…") and click **Install**.

### Step 9: Point Opilot at the Spark
1. Open Settings: `Ctrl+,` on Windows/Linux, `Cmd+,` on Mac.
2. Search for **opilot host**.
3. Set **Opilot: Host** to `http://192.168.1.50:11434` (your address).
4. Reload: press `Ctrl+Shift+P` (`Cmd+Shift+P` on Mac), type **Reload Window**, press Enter.

### Step 10: Pick a Spark model and chat
1. Open Copilot Chat: `Ctrl+Alt+I` on Windows/Linux, `Ctrl+Cmd+I` on Mac.
2. Click the model name under the chat box.
3. Choose **qwen3-coder:30b**. It shows a 🦙 **Ollama** label.
4. Ask something like "Explain what this file does". The first answer can take 10–30 seconds while the model loads. Later answers are faster.

If the model is not listed, click **Manage Models…** at the bottom of the list and make sure the Ollama models are shown.

### Step 11 (optional): Autocomplete from the Spark
In Settings, search for **opilot**, then:
- Tick **Enable Inline Completions**.
- Set **Completion Model** to `qwen2.5-coder:3b`.

Or add this to `settings.json`:
```json
"opilot.host": "http://192.168.1.50:11434",
"opilot.enableInlineCompletions": true,
"opilot.completionModel": "qwen2.5-coder:3b"
```

## Troubleshooting

| What you see | What to try |
| --- | --- |
| Browser can't open `http://<spark-ip>:11434` | Check both devices are on the same network. Re-run Step 4. Run `sudo ufw allow 11434/tcp` on the Spark. Run `hostname -I` again in case the address changed. |
| Browser works, but no Ollama models in VS Code | Check the Opilot Host setting has `http://` and `:11434`. Reload Window. Check VS Code is 1.111+. |
| Models vanished after a work account sign-in | Copilot Business/Enterprise admins can switch off "Bring your own language model key", which hides these models. Ask your admin or use a personal account. |
| Agent mode won't use tools | Only models with the 🛠 badge can call tools. `qwen3-coder:30b` supports tools. Small models may not. |
| Replies are very slow | The first reply loads the model into memory. For autocomplete, keep a 1–3B model. |
| Worked yesterday, not today | The Spark is off or asleep, or its address changed (see Step 5 tip). |

For more detail, set **Opilot › Diagnostics: Log Level** to `debug` and open **View → Output → Opilot**.

## Safer option: SSH tunnel
If you're not on a trusted home network, skip Step 4 and keep Ollama private to the Spark. Before you code each day, run this in a terminal on the laptop and leave the window open:
```bash
ssh -N -L 11434:localhost:11434 <your-spark-username>@<spark-ip>
```
Then set **Opilot: Host** to `http://localhost:11434`.

## Undo network access
Run this on the Spark to make Ollama private again:
```bash
sudo rm /etc/systemd/system/ollama.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

## Related
- [Local Hermes Daily Assistant (Qwen3 + Ollama + Unsloth + Obsidian)](./hermes-daily-assistant-setup.md)
- [GitHub Copilot Custom Instructions Tutorial](./github-copilot-custom-instructions-tutorial.md)
- [Right Selection of a Coding AI Agent (2026)](./coding-ai-agent-selection-tutorial.md)

## References
- [Opilot – GitHub repository (selfagency/opilot)](https://github.com/selfagency/opilot)
- [Opilot – VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=selfagency.opilot)
- [Opilot – User's Guide](https://opilot.self.agency/users/)
- [NVIDIA – DGX Spark vibe-coding playbook](https://github.com/NVIDIA/dgx-spark-playbooks/blob/main/nvidia/vibe-coding/README.md)
- [GitHub Changelog – Bring your own language model key in VS Code (April 2026)](https://github.blog/changelog/2026-04-22-bring-your-own-language-model-key-in-vs-code-now-available/)
- [Ollama – Run open models locally](https://ollama.com)
