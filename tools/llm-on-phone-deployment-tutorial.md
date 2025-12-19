# Unsloth Phone Deployment Tutorial (iOS + Android)

## Intent
- Provide a repeatable workflow to fine-tune, quantize, export, and run an LLM on a phone using Unsloth and ExecuTorch.
- Keep the steps copy-ready with the minimum tooling for iOS and Android deployment.

## Use when
- You want on-device inference for privacy, offline use, or low latency.
- You can target smaller models (0.6B to 4B) that fit mobile RAM and storage budgets.

## Prerequisites
- Python environment with Unsloth, TorchAO, and ExecuTorch (local or Colab).
- A supported base model (Qwen3, Gemma3, Llama3, Qwen2.5, Phi4 Mini).
- iOS: macOS with Xcode 15+ (simulator or device). Physical devices require a paid Apple Developer account.
- Android: Java 17, Android SDK/NDK, adb, Git, Wget/Curl, USB debugging enabled on the phone.

## 1. Train and quantize for phone deployment (Unsloth + TorchAO QAT)
Install the required tooling:

```bash
pip install --upgrade unsloth unsloth_zoo
pip install torchao==0.14.0 executorch pytorch_tokenizers
```

Enable phone deployment QAT during fine-tuning:

```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen3-0.6B",
    max_seq_length=1024,
    full_finetuning=True,
    qat_scheme="phone-deployment",  # Enables phone-optimized QAT
)
```

Notes:
- The phone deployment QAT path uses an INT8/INT4 quantization scheme under the hood to keep accuracy higher than naive post-training quantization.
- Keep the tokenizer artifact alongside the final model export (tokenizer.json, tokenizer.bin, or tokenizer.model depending on the base model).

## 2. Export the ExecuTorch .pte model
Example for Qwen3-0.6B (adjust names and config for your model):

```bash
# Convert checkpoint weights to ExecuTorch format
python -m executorch.examples.models.qwen3.convert_weights "phone_model" pytorch_model_converted.bin

# Fetch the matching ExecuTorch config
curl -L -o 0.6B_config.json \
  https://raw.githubusercontent.com/pytorch/executorch/main/examples/models/qwen3/config/0_6b_config.json

# Export to ExecuTorch .pte
python -m executorch.examples.models.llama.export_llama \
  --model "qwen3_0_6b" \
  --checkpoint pytorch_model_converted.bin \
  --params 0.6B_config.json \
  --output_name qwen3_0.6B_model.pte \
  -kv --use_sdpa_with_kv_cache -X --xnnpack-extended-ops \
  --max_context_length 1024 --max_seq_length 128 --dtype fp32 \
  --metadata '{"get_bos_id":199999, "get_eos_ids":[200020,199999]}'
```

Expected output:
- A `.pte` file (for Qwen3-0.6B, around 472 MB).
- A tokenizer file from the training run.

## 3. iOS deployment (ExecuTorch demo app)

### 3.1 macOS setup
Install and verify Xcode:

```bash
xcode-select -p
```

Expected output:
- `/Applications/Xcode.app/Contents/Developer`

If needed:

```bash
xcode-select --install
sudo xcodebuild -license accept
```

Open Xcode once to install any additional components. If prompted, install the iOS 18 simulator runtime.

### 3.2 Get the ExecuTorch iOS demo app

```bash
curl -L https://github.com/meta-pytorch/executorch-examples/archive/main.tar.gz | \
  tar -xz --strip-components=2 executorch-examples-main/llm/apple
```

Open `apple/etLLM.xcodeproj` in Xcode, select an iPhone simulator, and build once.

### 3.3 Simulator flow
1. Create a folder in the iOS simulator Files app (example: `Qwen3test`).
2. Locate the simulator folder path:

```bash
find ~/Library/Developer/CoreSimulator/Devices/ -type d -iname "*Qwen3test*"
```

3. Copy model assets into that folder:

```bash
cp tokenizer.json /path/to/Qwen3test/tokenizer.json
cp qwen3_0.6B_model.pte /path/to/Qwen3test/qwen3_0.6B_model.pte
```

4. Launch the app, select the model and tokenizer, and verify the chat screen loads.

### 3.4 Physical iPhone flow
- Add your Apple ID to Xcode and enable "Automatically manage signing".
- Set a unique Bundle Identifier and add the "Increased Memory Limit" capability (requires paid developer account).
- Enable Developer Mode on the iPhone and trust the developer certificate.
- Use Finder to drag the `.pte` and tokenizer files into the app's Files area.

## 4. Android deployment (ExecuTorch Llama demo)

### 4.1 Verify Java 17

```bash
java -version
```

Expected output:
- `openjdk version "17.0.x"`

If needed (Ubuntu/Debian example):

```bash
sudo apt install openjdk-17-jdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### 4.2 Install Android SDK and NDK (CLI only)

```bash
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-*.zip -d cmdline-tools
mv cmdline-tools/cmdline-tools cmdline-tools/latest
```

Note: the download URL above is for Linux. Use the matching command line tools archive for macOS or Windows if needed.

Add environment variables:

```bash
export ANDROID_HOME=$HOME/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

Install required SDK components:

```bash
yes | sdkmanager --licenses
sdkmanager "platforms;android-34" "platform-tools" "build-tools;34.0.0" "ndk;25.0.8775105"
export ANDROID_NDK=$ANDROID_HOME/ndk/25.0.8775105
```

### 4.3 Build the demo app

```bash
git clone https://github.com/meta-pytorch/executorch-examples.git
cd executorch-examples/llm/android/LlamaDemo
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./gradlew :app:assembleDebug
```

Expected output:
- `app/build/outputs/apk/debug/app-debug.apk`

Optional fixes if Gradle fails:

```bash
echo "sdk.dir=$HOME/android-sdk" > local.properties
```

```bash
# Linux
sed -i 's/e.getDetailedError()/e.getMessage()/g' \
  app/src/main/java/com/example/executorchllamademo/MainActivity.java
```

```bash
# macOS
sed -i '' 's/e.getDetailedError()/e.getMessage()/g' \
  app/src/main/java/com/example/executorchllamademo/MainActivity.java
```

### 4.4 Install the APK

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Expected output:
- `Success`

### 4.5 Transfer model and tokenizer
If the app cannot browse normal storage, push files to the expected directory:

```bash
adb shell mkdir -p /data/local/tmp/llama
adb shell chmod 777 /data/local/tmp/llama
adb push /path/to/tokenizer.json /data/local/tmp/llama
adb push /path/to/model.pte /data/local/tmp/llama
```

Then open the app Settings, select the model and tokenizer, and load the model.

## 5. Troubleshooting and performance notes
- Android builds must use Java 17. Java 21 often breaks Gradle toolchains.
- If the model fails to load, confirm you exported a valid ExecuTorch `.pte` file and selected the matching tokenizer.
- Large models can exceed mobile memory limits. Start with 0.6B to 4B models and shorten max sequence length if needed.
- Reported performance for Qwen3-0.6B is around 40 tokens/s on Pixel 8 and iPhone 15 Pro, but results vary by device.

## References
- Unsloth Documentation, "How to Run and Deploy LLMs on your iOS or Android Phone": https://docs.unsloth.ai/new/deploy-llms-phone
- ExecuTorch Examples Repository: https://github.com/meta-pytorch/executorch-examples
- Android Command Line Tools (Linux): https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
- ExecuTorch Qwen3 Config (0.6B): https://raw.githubusercontent.com/pytorch/executorch/main/examples/models/qwen3/config/0_6b_config.json
