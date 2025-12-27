# Generative AI Project Tutorial

## Intent
Use this tutorial to quickly bootstrap a reliable, auditable generative AI project by following a pre-structured layout with clear configuration, testing, and documentation practices.

## Project Overview
A structured generative AI project template for building robust and explainable AI applications while maintaining auditability and governance.

## Repository Layout
```text
generative_ai_project/
    config/
        __init__.py
        model_config.yaml
        prompt_templates.yaml
        logging_config.yaml
    src/
        __init__.py
        main.py
        clients/
            __init__.py
            sagemaker_client.py
            bedrock_client.py
            openai_client.py
        ui/
            __init__.py
            prompt_engineering_ui.py
        prompts/
            __init__.py
            base_prompts.py
            chatbot_prompts.py
            cli_prompts.py
            prompt_templates.py
            test_bed_prompts.py
        utils/
            __init__.py
            text_analyzer.py
            token_counter.py
            logger.py
            data_handler.py
    data/
        __init__.py
        raw/
            __init__.py
        processed/
            __init__.py
    tests/
        __init__.py
        test_utils.py
        test_clients.py
        test_prompts.py
    docs/
        __init__.py
        architecture.md
        requirements.md
        api.md
    examples/
        __init__.py
        basic_completion.py
        qa_chatbot.py
        __pycache__/
        notebooks/
            data_analysis.ipynb
            model_fine_tuning.ipynb
            prompt_testing_and_evaluation.ipynb
    Dockerfile
    README.md
```

## Key Components
- **config** — Keeps configuration files separate from code for portability and clarity.
- **src** — Houses the core project logic, organized by clients, UI, prompts, and utilities.
- **data** — Splits raw and processed datasets to preserve provenance.
- **tests** — Bundles unit and integration tests to ensure reliability.
- **docs** — Contains architecture notes, requirements, and API references.
- **examples** — Provides runnable samples and notebooks for quick experimentation.
- **Dockerfile** — Supports containerization for deployment and reproducibility.

## Best Practices
1. **Modular design** — Group related capabilities (clients, prompts, UI, utils) to simplify maintenance.
2. **Explicit configurations** — Externalize model and logging settings to versioned YAML files.
3. **Auditability** — Keep prompts, configurations, and data lineage traceable across directories.
4. **Testing strategy** — Cover utilities, prompt logic, and client integrations with automated tests.
5. **Documentation** — Maintain architecture, API, and requirements docs close to the code.
6. **Clear separation of concerns** — Distinguish configuration, core logic, data handling, and examples.

## Getting Started
1. Install dependencies for your selected model providers and tooling.
2. Configure the model provider credentials and defaults in the `config/` YAML files.
3. Run tests and linting to validate the base setup.
4. Start the development server or entrypoint in `src/main.py`.
5. Experiment with the samples in `examples/` or the bundled notebooks.
6. Deploy the project with the provided `Dockerfile` for consistent environments.

## Development Tips
- Follow linting and formatting rules to keep contributions consistent.
- Use environment variables for secrets to avoid committing sensitive data.
- Monitor API usage to manage cost and performance.

## References
- Source template: https://github.com/honestsoul/generative_ai_project
