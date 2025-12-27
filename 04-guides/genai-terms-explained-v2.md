# AI Terms Explained (Glossary v2)

## Intent
Transcribe the 85 common AI terms from the "AI Terms Explained" visual into a searchable, copy-friendly glossary while keeping the original glossary intact.

## Artificial Intelligence and core model families
- **Artificial Intelligence (AI):** Systems that perform tasks typically requiring human cognition such as reasoning, learning, perception, and decision making.
- **Machine Learning (ML):** The field of AI where systems learn patterns from data rather than following explicit program rules.
- **Deep Learning (DL):** ML using multi-layered neural networks that learn hierarchical representations from large datasets.
- **Neural Network:** Computational model using interconnected weighted nodes inspired by how neurons process information.

## Learning paradigms
### Supervised learning
- **Training data:** Labeled input-output pairs used to teach the model.
- **Goal:** Learn to predict outputs for new inputs.
- **Classification:** Predict discrete labels.
- **Regression:** Predict continuous values.
- **Sequence-to-sequence:** Map an input sequence to an output sequence.
- **Overfitting:** Model memorizes training data and performs poorly on new data.
- **Underfitting:** Model is too simple to capture patterns.
- **Evaluation:** Compare predicted labels/values with ground truth.
- **Most useful when:** You have labeled data and need predictions.

### Unsupervised learning
- **Goal:** Discover structure in unlabeled data.
- **Clustering:** Group similar data points (K-Means, Hierarchical, DBSCAN).
- **Association rules:** Find relationships between items (Apriori, FP-Growth).
- **Dimensionality reduction:** Compress data while retaining structure (PCA, t-SNE, UMAP).
- **Anomaly detection:** Spot outliers.
- **Most useful when:** You have unlabeled data and want to explore patterns.

### Semi-supervised learning
- **Goal:** Combine labeled and unlabeled data to improve performance.
- **Most useful when:** Labeled data is scarce or expensive.

### Reinforcement learning
- **Goal:** Learn actions that maximize cumulative reward in an environment.
- **Policy:** Strategy for choosing actions.
- **Reward:** Feedback signal for actions.
- **Value function:** Expected cumulative reward.
- **Q-value:** Expected cumulative reward for action `a` in state `s`.
- **Q-learning:** Learn Q-values directly.
- **Deep Q-Learning:** Use a neural net to approximate Q-values.
- **Exploration vs. exploitation:** Trade off trying new actions vs. using known good ones.
- **Episodes and timesteps:** Interaction over steps in an episode.
- **Most useful when:** Goal is to optimize actions or decisions.

## Model architecture and training
- **Model architecture:** Structure and components (e.g., CNN, RNN, Transformer, GPT, BERT).
- **Training data:** Dataset used to learn parameters; must be representative to reduce bias.
- **Training vs. inference:** Training adjusts model weights; inference makes predictions using learned weights. Inference speed is critical for production.
- **Training pipeline:** Data prep (cleaning, features), model training, validation, hyperparameters, early stopping.
- **Loss function:** Measures prediction error (MSE, cross-entropy). Optimized during training.
- **Backpropagation:** Calculates gradients to update weights.
- **Gradient descent:** Optimization using gradients (SGD, Adam, Adagrad).
- **Epoch:** One full pass through the training data.
- **Batch size:** Number of samples per training update.
- **Learning rate:** Step size for weight updates (decay/warmups common).
- **Overfitting:** Model fits noise in training data.
- **Generalization:** Performance on unseen data; good generalization is the goal.
- **Transfer learning:** Reuse pretrained models for new tasks.
- **Fine-tuning:** Adapt pretrained models with task-specific data.
- **Zero-shot:** Perform tasks without examples.
- **Few-shot:** Perform tasks with a few examples.

## NLP and language
- **Natural Language Processing (NLP):** Methods for working with human language data.
- **Tokenization:** Break text into tokens (words, subwords, characters).
- **Embedding:** Numerical vector representation capturing semantic meaning.
- **Embedding space:** Geometric space where similar items cluster; **vector database** stores embeddings for retrieval.
- **Named Entity Recognition (NER):** Identify entities like people, organizations, locations, dates.
- **Part-of-Speech (POS) tagging:** Label word roles (noun, verb, etc.).
- **Dependency parsing:** Analyze grammatical structure and relationships between words.
- **Machine translation:** Translate text between languages.
- **Speech Recognition (ASR):** Convert speech to text.
- **Summarization:** Produce concise text (extractive selects sentences; abstractive generates new text).
- **Retrieval-Augmented Generation (RAG):** Retrieve relevant documents and generate answers grounded in them.
- **Large Language Model (LLM):** Autoregressive model predicting next tokens. Often trained with Reinforcement Learning from Human Feedback (RLHF). Comes with safety filters and usage policies.
- **Prompt engineering:** Crafting inputs (role, task, context, constraints) to guide model outputs.
- **Input context window:** Maximum tokens model can read at once. **Context length** matters.
- **Output tokens / output length / generation length / truncation:** Control how much the model generates.
- **Temperature:** Controls randomness; lower is focused, higher is creative.
- **Top-k sampling:** Sample from the top-k probable next tokens.
- **Top-p (nucleus) sampling:** Sample from smallest set of tokens whose cumulative probability exceeds `p`.
- **Beam search:** Explore multiple candidate sequences. **Beam width** is candidates kept. Risk of repetitive or degenerate outputs if too wide.
- **Perplexity:** How well a model predicts a sample; lower is better.
- **Hallucination:** Fluent but incorrect or fabricated output.

## Vision and multimodal
- **Computer vision:** Techniques for understanding images/video.
- **Object detection:** Identify objects and draw bounding boxes. Can be multi-class or multi-label.
- **Image classification:** Assign labels to images.
- **Segmentation:** Label each pixel (semantic) or each object instance (instance segmentation).
- **Optical Character Recognition (OCR):** Extract text from images.
- **Image generation models (e.g., Stable Diffusion):** Text-to-image generation using diffusion in latent space; prompt guidance weights influence the result. **Negative prompt** steers away from content. Bias and safety filters can affect outputs.
- **Multimodal models:** Handle multiple modalities (text, image, audio, video). Examples: Visual Question Answering (VQA), text embeddings with image inputs, text generation from images. Some can perform optical reasoning, audio processing, and video processing.

## Generative AI
- **Generative AI:** Models that generate new content (text, images, audio, video, 3D) from training data patterns.
- **Generative model:** Learns the data distribution to create new samples. Types include GANs, VAEs, autoregressive models.
- **Generative Adversarial Network (GAN):** Two networks (generator creates samples; discriminator distinguishes real vs. fake) trained adversarially until the generator fools the discriminator.
- **Mode collapse:** GAN problem where the generator produces limited varieties.
- **Training instability:** GAN training can diverge.
- **Variational Autoencoder (VAE):** Encoder maps input to latent variables; decoder reconstructs data. Uses regularization; samples can be blurry but diverse.

## Model behavior and problems
- **Bias:** Systematic errors favoring certain outcomes.
- **Fairness:** Treat different groups equitably.
- **Robustness:** Model performs reliably under noise/perturbations.
- **Calibration:** Confidence estimates align with actual correctness.
- **Interpretability & explainability:** Understanding model predictions (e.g., SHAP, LIME).
- **Concept drift:** Target relationships change over time.
- **Data drift:** Input data distribution shifts.
- **Adversarial examples:** Small input perturbations that mislead models.
- **Safety filters:** Guardrails to block harmful outputs.
- **Defensive prompting:** Strong safety prompts reduce harmful outputs; weak ones can be bypassed.
- **Prompt injection / jailbreak:** Malicious prompts override instructions; **jailbreak** breaks restrictions.

## AI agents and systems
- **AI agent:** System that perceives, reasons, and acts toward goals.
- **Actions:** Tool use, API calls, or multi-step planning.
- **Agentic workflow:** Break top-level task into subtasks; maintain a world model; use memory; plan and use tools; learn from outcomes; provide justifications and citations.
- **System prompt:** Governing instructions for an LLM or agent.
- **Tool call planning:** Choose the right tool and arguments; tools may fail (wrong query, API failure). Examples: calculator, search, SQL, API calls, code generation, Python execution. Include fallback plans.

## Evaluation and metrics
- **Evaluation plan:** Defines what “good” looks like; combines automatic metrics with human review.
- **Train/validation/test split:** Separate datasets to estimate generalization. Cross-validation averages performance; stratification balances classes; avoid data leakage.
- **Classification metrics:** Accuracy, precision, recall, F1-score, ROC-AUC.
- **Regression metrics:** MSE, RMSE, MAE, R².
- **Ranking metrics:** MRR, NDCG.
- **Translation metric:** BLEU score.
- **Summarization metrics:** ROUGE, METEOR.
- **Embedding similarity:** Cosine similarity to compare embeddings.
- **Human evaluation:** Use clear instructions, criteria, and rubric; align scales with prompts.
- **Benchmark:** Evaluation suite with gold-standard answers; can be open competitions/contests.

## Safety and ethics
- **Safety:** Prevent harm from model misuse; includes alignment, misuse prevention, bias mitigation, fairness.
- **AI ethics:** Principles like fairness, accountability, transparency; data privacy and consent; governance.
- **Privacy-preserving techniques:** Anonymization, differential privacy, federated learning, encryption, consent management.

## Infrastructure and deployment
- **Model size:** Number of parameters; influences memory and compute.
- **Latency:** Time to produce output.
- **Throughput:** Requests processed per second.
- **Scaling:** Horizontal vs. vertical scaling.
- **Model serving:** Deploy models for real-time or batch inference.
- **On-device inference:** Run models on edge/mobile devices for lower latency and privacy.
- **Observability:** Monitoring, logging, tracing.
- **MLOps:** Practices for training, deployment, CI/CD, automated testing.
- **Data pipeline:** ETL (extract, transform, load) processes.
- **GPU / TPU:** Specialized hardware for training/inference.
- **Containerization:** Package apps and dependencies (e.g., Docker).
- **Orchestration:** Manage containers/services (e.g., Kubernetes).
- **APIs:** Interface for model access; rate limits, authentication, caching.
- **A/B testing:** Compare variants; manage traffic splitting and rollbacks.

## Advanced concepts
- **Knowledge graph:** Structured representation of entities and relationships (nodes/edges) enabling reasoning.
- **Causal inference:** Identify cause-effect relationships; distinguish correlation vs. causation; consider confounders; use causal graphs; design interventions.
- **AutoML:** Automate model selection and tuning (hyperparameters, data prep).
- **Meta-learning:** “Learning to learn”; models improve across tasks (few-shot learning, tasks as data).
- **Curriculum learning:** Train on gradually harder data to stabilize/improve training.
