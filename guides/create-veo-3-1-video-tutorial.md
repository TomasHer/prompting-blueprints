# Create Cinematic Videos with Google Veo 3.1

## Intent
Help prompt engineers and creatives plan, generate, and iterate Veo 3.1 video generations using Google's Flow app while applying Google's official prompting guidance.

## Prerequisites
- Google account with access to [Google Labs Flow](https://labs.google/fx/tools/flow) and Veo 3.1 in your region.
- Sufficient Google One AI credits or an active plan that includes Veo video generation.
- Source material or concept outline you want to visualize (storyboard, script beats, or mood references).

## Step 1 — Confirm Billing and Credits
1. Visit the [Google One AI credits dashboard](https://support.google.com/googleone/answer/16287445?visit_id=638968334505579471-862084453&p=g1_ai_credit_menu&rd=1#g1_ai_credit_menu) to review your current allowance and refresh dates.
2. Note the credit cost per Veo render in Flow. Adjust your storyboard to fit the number of clips you can afford before you start prompting.
3. Decide on your iteration plan (e.g., two exploratory clips, one polished clip). Tracking credits up front prevents surprises mid-workflow.

## Step 2 — Frame the Video Concept
- Summarize the story beat for each 4–8 second segment you want to cover.
- Identify the cinematic perspective (camera angle, movement, lens) for each beat.
- Collect texture references: wardrobe, lighting, color palette, sound design cues. These become modifiers in your prompts.

> Tip: In Veo prompts, **describe the subject first, then the action, then the environment and mood**. Reserve stylistic cues (e.g., "cinematic lighting", "soft depth of field") for the end to avoid crowding the core description.

## Step 3 — Build Segment-by-Segment Prompts
Structure each prompt with clear timestamps and shot directions. Use brackets for time ranges and separate lines for clarity.

**Example storyboard prompt**
```
[00:00-00:04] Medium shot from behind a young female explorer with a leather satchel and messy brown hair in a ponytail, as she pushes aside a large jungle vine to reveal a hidden path.
[00:04-00:08] Reverse shot of the explorer's freckled face, her expression filled with awe as she gazes upon ancient, moss-covered ruins in the background. SFX: The rustle of dense leaves, distant exotic bird calls.
```

### Prompt construction checklist
| Element | Why it matters | Example language |
| --- | --- | --- |
| Subject & action | Grounds the shot in a focal character and motion. | "Young female explorer", "pushes aside a large jungle vine" |
| Camera & composition | Guides Veo's framing and movement. | "Medium shot from behind", "Reverse shot" |
| Environment | Adds depth and contextual detail. | "Ancient, moss-covered ruins" |
| Mood & audio cues | Sets tone and timing for Flow's audio bed. | "Rustle of dense leaves", "distant exotic bird calls" |

## Step 4 — Generate in Flow
1. Open [Flow](https://labs.google/fx/tools/flow) and choose the **Veo 3.1** generator.
2. Paste your segment prompts into the text field. Keep each segment on its own line to help Veo respect the temporal order.
3. Select aspect ratio, duration, and stylization presets if available. Match them to your storyboard (e.g., 16:9 for cinematic, square for social).
4. Trigger the generation. Each render debits credits based on length/resolution, so monitor your remaining balance after each run.

## Step 5 — Evaluate and Iterate
- **Shot accuracy**: Does each timestamp reflect the intended camera move? If not, add more explicit direction (e.g., "smooth dolly-in" or "static tripod shot").
- **Subject fidelity**: If characters drift, reinforce attributes every line (hair, wardrobe, props).
- **Continuity**: Use connective phrasing ("continues from previous shot") when you want Veo to maintain the same character or setting across segments.
- **Audio polish**: Flow generates ambient sound. Add or remove specific cues by labeling them (`SFX:`) and describing intensity (e.g., "soft", "resonant").
- **Version control**: Save high-performing prompts in a shared doc and label them by iteration so your team can reuse the best templates.

## Step 6 — Prep for Delivery
- Export the clip from Flow in the resolution your distribution channel requires.
- Pair the video with post-processing notes (color grade tweaks, external sound design) for collaborators.
- Archive the final prompt, Flow settings, and generated asset in your project folder to speed up future revisions.

## Troubleshooting Prompts
- **Overly busy shots**: Split dense actions into separate segments or simplify the environment description.
- **Inconsistent lighting**: Specify lighting type each time (`"golden hour backlight"`, `"dappled jungle light"`).
- **Missing motion cues**: Include verbs describing camera movement (`"handheld sway"`, `"slow crane up"`).
- **Audio mismatches**: Clarify whether you want silence (`"SFX: none"`) or foreground vs. background sound (`"SFX: subtle"`, `"SFX: loud"`).

## References
- Google Cloud. *The ultimate prompting guide for Veo 3.1*. https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1
- Google One Help. *Check or manage your AI Premium Plan credits*. https://support.google.com/googleone/answer/16287445?visit_id=638968334505579471-862084453&p=g1_ai_credit_menu&rd=1#g1_ai_credit_menu
