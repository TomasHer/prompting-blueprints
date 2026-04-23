---
title: "Presentations Prompting Blueprints (Patrick Winston)"
intent: ""
model_tested: []
tags: ["patterns", "presentations-blueprints"]
last_updated: "2026-04-09"
---

# Claude Can Now Prepare Your Presentations Using the Exact Framework Patrick Winston Taught MIT Students for 40 Years

Patrick Winston spent four decades teaching MIT students how to give talks that change minds. His framework is precise, ruthless, and built around one principle: every element of a presentation either serves the audience or wastes their time. There is no middle ground.

The prompts below apply Winston's framework directly. Each one forces Claude to stop, gather the right inputs, and produce output that follows the rules Winston enforced in his legendary How to Speak lectures.

---

## 1. Start Any Presentation Right

```text
<role>Act as a presentation coach applying Patrick Winston's MIT framework.
Every talk must open with an empowerment promise that tells the audience
exactly what they will know by the end that they didn't know at the beginning.
</role>

<task>Write a powerful opening for my presentation that makes the audience
immediately understand why staying is worth every minute of their time.</task>

<steps>
1. STOP and ask me three questions before writing anything: (a) presentation
topic, (b) specific audience, (c) one concrete capability or insight they should
walk away with. Do not proceed until I answer all three.
2. Restate the single most valuable takeaway in one sentence and confirm it
with me.
3. Write the empowerment promise: specific, outcome-driven, impossible to
ignore (max 2 sentences).
4. Write the first 60 seconds verbatim, covering promise, context, and why
this matters now (120 to 150 words).
5. List everything that must be cut from the opening (jokes, thank yous,
apologies, throat-clearing) and explain why each weakens the promise.
</steps>

<rules>
- Never open with a joke. The audience isn't ready.
- Never open with "thank you for having me." It's weak and forgettable.
- Empowerment promise must be specific. Not "you'll learn about X" but "by the
  end you'll be able to do Y."
- First 60 seconds must earn the next 60 minutes.
- Cut everything that doesn't serve the promise.
- Do not invent details about my topic. Ask if uncertain.
</rules>

<output>Empowerment Promise → First 60 Seconds Script → What to Cut</output>
```

---

## 2. Eliminate Your Slide Crimes

```text
<role>Act as a slide crime investigator applying Patrick Winston's MIT framework.
Every presentation crime that puts audiences to sleep gets identified,
prosecuted, and eliminated.</role>

<task>Audit my presentation slides and eliminate every crime Winston identified
that makes audiences disengage, sleep, or leave mentally.</task>

<steps>
1. STOP and ask me to either paste my slide content or describe each slide
(title, body text, visuals). Do not proceed without this. No audit is possible
from assumptions.
2. Check every slide against these 10 Winston slide crimes:
   - Too many slides for the time available
   - Too many words per slide (over ~25)
   - Font size under 40pt
   - Reading slides aloud verbatim
   - Laser pointer usage (breaks eye contact)
   - Speaker standing far from the screen
   - No white space (visual suffocation)
   - Background clutter, logos, or institutional branding
   - Collaborators list as the final slide
   - "Thank you" or "Questions?" as the final slide
3. For each crime found, report: slide number, crime, and specific fix (not a
flag, an action).
4. Redesign the final slide as a Contributions slide that restates what the
audience now knows.
5. Deliver a clean slide brief: what stays, what goes, what changes.
</steps>

<rules>
- Every crime must have a specific fix, not just a flag.
- Font minimum 40pt. No exceptions.
- Final slide must be contributions. Never questions or thank you.
- White space is not wasted space. It's breathing room for the audience's brain.
- Slides are condiments, not the main event.
</rules>

<output>Crime Audit → Fix per Crime → Final Slide Redesign → Clean Slide Brief</output>
```

---

## 3. Make Your Ideas Unforgettable

```text
<role>Act as a personal brand architect applying Patrick Winston's Star
framework (Symbol, Slogan, Surprise, Salient idea, and Story) to make any
idea impossible to forget.</role>

<task>Apply Winston's Star to my core idea so it sticks in every audience's
mind long after the presentation ends.</task>

<steps>
1. STOP and ask me three questions: (a) my core idea in one sentence, (b) my
specific audience, (c) the one thing I want them to remember a week later.
Do not proceed until answered.
2. Symbol: propose a concrete visual or physical object that represents the
idea instantly. Describe it in enough detail to sketch.
3. Slogan: write a short phrase (under 8 words) that becomes the handle
people use to recall the idea.
4. Surprise: name the counterintuitive truth that challenges what the audience
already believes. State the assumption first, then the reversal.
5. Salient idea: sharpen the ONE idea that must stick out above everything
else. Cut anything competing with it.
6. Story: write a 4 to 6 sentence narrative covering how it works, why it
matters, and the journey that led here.
7. Deliver a Winston Star Summary that shows all five elements together on
one page.
</steps>

<rules>
- Symbol must be visual and specific, not abstract.
- Slogan must be repeatable in a meeting without explanation.
- Surprise must genuinely challenge an assumption, not just be interesting.
- Salient idea must be one. Never two or three.
- Story must be personal enough to be specific, universal enough to resonate.
- Do not invent facts about my work. Ask if uncertain.
</rules>

<output>Symbol → Slogan → Surprise → Salient Idea → Story → Winston Star Summary</output>
```

---

## 4. Structure Any Talk That Persuades

```text
<role>Act as a persuasion architect applying Patrick Winston's job talk
framework (vision, proof of work, and contributions) to any presentation
that needs to convince, convert, or close.</role>

<task>Structure my talk so the audience knows my vision, believes I've done
something significant, and remembers exactly what I contributed, all within
the first 5 minutes.</task>

<steps>
1. STOP and ask me three questions: (a) presentation goal, (b) specific
audience, (c) the one action I want them to take afterward. Do not proceed
until answered.
2. Build the vision statement: name the problem someone cares about and my
new approach (2 to 3 sentences).
3. Design the proof of work: list the concrete steps I took that prove I've
done something real (3 to 5 specific items, not vague accomplishments).
4. Write the 5-minute opening verbatim (600 to 750 words) that establishes
both vision and credibility.
5. Build the contributions close: the final slide content that mirrors the
opening promise (bullet list of what the audience now has that they didn't
before).
6. Deliver the full talk structure showing how each section advances either
vision or proof.
</steps>

<rules>
- Vision must be established within 5 minutes. Never later.
- Proof of work must be specific steps, not vague accomplishments.
- Opening and close must mirror each other. Promise made, promise kept.
- Contributions slide stays up during questions. Never replaced with "thank
  you."
- Every minute must advance either vision or proof. Nothing else.
</rules>

<output>Vision Statement → Proof of Work → 5-Minute Opening → Contributions
Close → Full Talk Structure</output>
```

---

## 5. Use Props and Stories to Teach Anything

```text
<role>Act as a teaching design specialist applying Patrick Winston's prop and
storytelling frameworks: the techniques that make ideas feel physical,
memorable, and impossible to misunderstand.</role>

<task>Design a prop or demonstration that makes my most complex idea feel as
simple and physical as holding it in your hands.</task>

<steps>
1. STOP and ask me four questions: (a) the complex idea I need to teach,
(b) my audience, (c) whether I'm presenting in person, virtually, or both,
(d) what currently confuses people most about the idea. Do not proceed until
answered.
2. Name the single most confusing aspect of the idea in one sentence.
3. Design a physical prop or demonstration that makes the confusion disappear.
If I'm presenting virtually, design a screen-friendly equivalent (object on
camera, live demo, simple visual artifact).
4. Build a 3-act story around the prop: tension (the confusion), demonstration
(the prop in action), resolution (the clarity it produces). 4 to 6 sentences
per act.
5. Write the verbal script (200 to 300 words) that guides the audience from
confusion to clarity, including stage directions for when to hold up, point
at, or use the prop.
6. Deliver the full teaching sequence ready to rehearse.
</steps>

<rules>
- Prop must be physical and demonstrable, not a slide or diagram.
- Story must have genuine tension before the resolution.
- Script must guide attention. Tell them where to look and what to notice.
- Demonstration must work even if it fails. The failure itself should teach
  something.
- For virtual presentations, the prop must still be a real object on camera,
  not a graphic.
</rules>

<output>Confusing Concept → Prop Design → Story Arc → Verbal Script →
Teaching Sequence</output>
```
