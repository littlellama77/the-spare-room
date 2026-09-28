# The Spare Room 🛋️🌱
> **Scratch it off. Watch your world grow.**

*The Spare Room* is a calm, tactile task-initiation workspace designed for people who struggle with executive dysfunction, task initiation, working memory, and overwhelm.

Rather than a generic digital checkbox, *The Spare Room* introduces the **satisfaction of physically crossing a task off a paper to-do list** and watching it transform directly into your living world.

---

## 🔄 The Core Emotional Loop

```
SEE IT
  ↓
MAKE IT SMALL
  ↓
DO IT
  ↓
PHYSICALLY GET RID OF IT (SCRATCH!)
  ↓
WATCH IT BECOME PART OF YOUR WORLD (flying seeds travel to the world)
  ↓
FEEL THE PROGRESS
```

---

## ✏️ The Signature Scratch Interaction (User-Controlled Gesture)

1. **User Performs the Gesture (Zero Auto-Scratch)**
   * The app **never** automatically draws the line for you.
   * When a work session ends, the task appears as an unscratchable physical paper slip:
     `□ Write the introduction`
     *"You did the thing. Scratch it off."*
   * The screen stays otherwise quiet, waiting for the user to perform the satisfying physical action.

2. **Real-Time Freehand Ink Canvas**
   * **Desktop**: Mouse drag across the words.
   * **Mobile / Tablet**: Touch drag across the words (`touch-action: none`).
   * **Stylus**: Pressure-sensitive stroke width support.
   * Renders real-time terracotta clay marker ink (`#C2593F`) with organic slight jitter, pressure/speed variation, and subtle paper fiber bleed.
   * Synthesizes real-time **frictional graphite ticks** via native Web Audio API as your pointer moves across paper fibers.

3. **Forgiving Crossing Threshold**
   * Crossing approximately **60–70%** of the task text span triggers completion.
   * Supports multiple strokes (e.g. scribble or back-and-forth strokes accumulate).

4. **Satisfying Hold & Reward Sequencing**
   * Upon reaching the threshold:
     * Checkbox pops into `✓`.
     * Badge shows `✓ DONE`.
     * Task text is struck through with organic line: `~~Write the introduction~~ ✓`.
     * Celebratory warm chime plays.
   * **The crossed-out task remains visible for ~1 second** so the user can pause and feel: *"I finished it, and I personally got it out of my way."*
   * **THEN** rewards unlock: emerging seeds (`🌱 🌸 🪨`) float out, travel across the screen to the living world diorama, and the world grows!

5. **Completed Tray (Physical Evidence of Progress)**
   * After the scratch, the slip physically slides down into the **Completed Today** tray.
   * Completed work doesn't vanish into a void—you can see your crossed-out accomplishments resting on your desk!

6. **Accumulated Evidence on the Calendar Desk**
   * On the 7-day wall calendar desk below, completed work dots also receive a permanent organic hand-drawn scratch slit (`~~●~~`).
   * The desk visibly accumulates evidence of your momentum over the days of the week.

7. **Progressive Disclosure**
   * Tapping the project tag on the hero slip unfolds the **Project Details Drawer** showing the timeline (`TODAY ● ━━━━━ ● ━━━━━ ◆ FRIDAY`) and remaining sessions without cluttering the main screen.

---

## 🚀 Running Locally

1. **Serve with Node.js**:
   ```bash
   node dev-server.js
   ```
2. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
