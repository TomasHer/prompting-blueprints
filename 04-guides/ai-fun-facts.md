---
title: "AI Fun Facts"
tags: ["guides", "fun-facts", "llm-scale"]
last_updated: 2026-07-17
---

# AI Fun Facts

## Intent
Collect memorable, **sourced** AI facts and figures — the kind that make an audience sit up — so you can open a talk, spice up a LinkedIn post, or kick off a workshop with a number people will repeat. Every fact ships with its source, the underlying math where possible, and honest caveats.

## Use when
- You need a hook for a keynote, lecture, or workshop icebreaker.
- You want a "did you know?" segment for a newsletter or LinkedIn post (see the copy-ready prompts below).
- You saw a viral AI statistic and want a template for sanity-checking it before you share it.

---

## Featured fact: LLMs now generate more text than humanity speaks 🚀

An infographic shared by [GPT-Lab (Tampere University)](https://gpt-lab.eu) — sparked by lab vice head Dr. Jussi Rasku being "curious about one number" — charts daily LLM token production against how much text humanity itself produces, and finds that machines have already crossed the human baselines:

| Milestone | When | Tokens per day |
| --- | --- | --- |
| LLMs surpassed **human writing** | Q3 2025 | ~70T/day |
| LLMs surpassed **human speech** | Q4 2025 | ~140T/day |
| On track to match **all human output** (speaking + writing + thinking) | Q2 2027 (projection) | ~740T/day |

The chart behind it plots LLM tokens generated per day on a log scale: from roughly single-digit **billions** per day in Q1 2023 to ~1,000T (one quadrillion) per day projected by Q3 2027 — with the verified curve crossing the writing baseline (~70T) and speech baseline (~140T) in 2025, and the projected dotted tail crossing the all-human-output line (~740T) in early 2027.

### The human baselines (per person, per day)
| Channel | Estimate | Notes |
| --- | --- | --- |
| Speech | 13,000 words × 1.33 tokens/word | ≈ 17,300 tokens/person/day |
| Writing | 6,500 words | 19 h/week at ~40 WPM estimate |
| Thinking | ~50,000 word-equivalents | Inner speech — explicitly flagged as speculative |

### The back-of-envelope math
The baselines multiply out cleanly against a world population of ~8.1 billion:

- **Speech:** 13,000 words × 1.33 ≈ 17,300 tokens × 8.1B people ≈ **~140T tokens/day**
- **Writing:** 6,500 words × 1.33 ≈ 8,600 tokens × 8.1B people ≈ **~70T tokens/day**
- **Everything incl. thinking:** ~69,500 word-equivalents ≈ 92,400 tokens × 8.1B ≈ **~750T tokens/day** (the ~740T line)

That is exactly the kind of Fermi estimate worth showing an audience: the "wow" number falls out of two everyday quantities (words per person, people on Earth).

### Key LLM drivers cited
| Provider | Reported volume |
| --- | --- |
| China NDB | 30T/day (Jun '25) → 140T/day (Mar '26) |
| Google | ~107T/day (I/O, May '26, official) |
| ByteDance Doubao | 120T/day (Apr '26) |
| OpenAI API | ~8.6T/day (Oct '25) and growing |

### Caveats before you quote it
- The "thinking" baseline (~50,000 word-equivalents of inner speech) is labeled **speculative** in the original — treat the 740T line as a thought experiment, not a measurement.
- Provider volumes are self-reported at different dates; the 2026–2027 tail is a **projection**.
- Tokens ≠ read text: most machine tokens are agent scaffolding, retries, and intermediate reasoning that no human ever sees.

---

## More fun facts (starter set)

| Fact | Why it lands | Source |
| --- | --- | --- |
| The transformer architecture behind every modern LLM was introduced in a single 2017 paper, *Attention Is All You Need* — a title riffing on The Beatles' "All You Need Is Love." | One paper, ~10 pages, reshaped the entire industry. | [arXiv 1706.03762](https://arxiv.org/abs/1706.03762) |
| A rule of thumb: **1 token ≈ ¾ of an English word**, so 100 tokens ≈ 75 words. | Makes token pricing and context windows instantly intuitive. | [OpenAI Help – What are tokens?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) |
| Training compute for frontier AI models has grown roughly **4–5× per year** since 2010 — far outpacing Moore's law. | Explains why capabilities keep jumping between model generations. | [Epoch AI – Machine Learning Trends](https://epoch.ai/trends) |

---

## Copy-ready prompts

### Turn a fact into a LinkedIn post
```text
ROLE: You are a tech communicator writing for a professional LinkedIn audience.
INPUT: <paste one fun fact, its source, and its caveats from this page>
CONSTRAINTS:
- Open with the number, not the context.
- Keep it under 120 words; short paragraphs; no hashtag spam (max 3).
- Include the caveat honestly in one sentence — do not oversell projections as facts.
- End with a question that invites discussion.
OUTPUT FORMAT: Plain text post, then a one-line source attribution.
```

### Verify a viral AI statistic before sharing
```text
ROLE: You are a skeptical fact-checker with strong Fermi-estimation skills.
INPUT: <paste the viral claim and where you saw it>
STEPS:
1. Decompose the claim into measurable quantities.
2. Estimate each quantity from first principles (state your assumptions).
3. Multiply out and compare your estimate to the claim.
4. Search for the primary source; note if only secondary posts exist.
OUTPUT FORMAT: Markdown with sections: Claim, Assumptions, Estimate, Verdict
(Plausible / Overstated / Unsupported), What I could not verify.
```

---

## Add your own fact
Keep the collection honest — each new entry needs all four fields:

```markdown
| Fact | Why it lands | Source |
| --- | --- | --- |
| <one-sentence fact with the number up front> | <why an audience remembers it> | <link to a primary source> |
```

1. **Fact** — one sentence, number first, no adjectives doing the work.
2. **Source** — primary source preferred; register it in [`external-sources.md`](../external-sources.md).
3. **Math** — if the fact is a big number, show the Fermi estimate that supports it.
4. **Caveat** — say what is measured vs. projected vs. speculative.

## Related pages
- [AI Gone Wrong Incident Stories](./ai-gone-wrong-stories.md) — the cautionary-tale counterpart to this page.
- [GAISE 2026 conference notes](../09-conferences/gaise-2026.md) — more from GPT-Lab (Tampere University), including Dr. Jussi Rasku's "Tools That Use Tools to Build Tools" lab.
- [Generative AI Basics Glossary](./genai-basics-glossary.md) — definitions for tokens, context windows, and friends.

## References
- [GPT-Lab (Tampere University)](https://gpt-lab.eu) — original infographic "LLMs Now Generate More Text Than Humanity Speaks," shared on the lab's LinkedIn feed (data transcribed above with attribution).
- [Attention Is All You Need (arXiv 1706.03762)](https://arxiv.org/abs/1706.03762)
- [OpenAI Help – What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)
- [Epoch AI – Machine Learning Trends](https://epoch.ai/trends)
