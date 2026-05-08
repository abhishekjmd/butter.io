# Figma AI MVP â€” Idea Validator

A minimal testbed to validate: **"Can AI generate JSON that a Figma plugin turns into a real, editable design?"**

No auth. No database. No deployment. Runs locally in ~5 minutes.

---

## Architecture

```
[HTML prompt input / CLI script]
          â†“
[Claude API â€” generates structured JSON schema]
          â†“
[Zod validation â€” ensures schema is correct]
          â†“
[JSON saved to file / passed to plugin]
          â†“
[Figma Plugin â€” reads JSON, creates Figma nodes]
          â†“
[Fully editable Figma design âœ“]
```
........
---

## Setup

### 1. Install dependencies

```bash
pnpm install
# or: npm install
```

### 2. Set your API key

```bash
export ANTHROPIC_API_KEY=sk-ant-api03-...
# PowerShell:
$env:ANTHROPIC_API_KEY="sk-ant-api03-..."
```

### 3. Generate a schema

```bash
# Default prompt
npx tsx scripts/generate.ts

# Custom prompt
npx tsx scripts/generate.ts "Create a landing page for a design tool called Prism with a bold hero, feature grid, and pricing"
```

Schema is saved to `test-output/schema-<timestamp>.json`

---

## Installing the Figma Plugin

1. Open Figma desktop app
2. Go to **Plugins â†’ Development â†’ Import plugin from manifest**
3. Select `manifest.json` from this folder
4. Plugin appears under **Plugins â†’ Development â†’ Figma AI MVP**

---

## Using the Plugin

### Option A â€” Paste Schema (recommended for testing)
1. Run the generate script (step 3 above)
2. Open the plugin in Figma
3. Paste the contents of your `test-output/*.json` file
4. Click **Generate Design**

### Option B â€” AI Generate (from inside plugin)
1. Open the plugin in Figma
2. Switch to **AI Generate** tab
3. Enter your Anthropic API key
4. Type a prompt and click **Generate with AI**

---

## What Gets Generated

Each prompt produces:
- **Navbar** â€” Logo, nav links, CTA button (horizontal auto-layout)
- **Hero** â€” Badge, display headline, body text, button, image placeholder
- **Features** â€” 3-column grid of cards with icon, title, description
- **Pricing** â€” 3 cards (one featured/highlighted), with tiers and CTAs
- **Footer** â€” Logo, links, copyright

All sections use:
- âœ… Auto-layout (horizontal + vertical + grid with wrap)
- âœ… Consistent 8pt spacing grid
- âœ… Design token colors (not arbitrary hex)
- âœ… Constrained typography scale
- âœ… Proper Figma node naming

---

## What to Validate

After generating a design, check:

| Question | Where to check |
|---|---|
| Does it look like a real design? | Visual inspection |
| Can you click elements and see padding/spacing? | Select a frame in Figma |
| Do auto-layout settings appear in the panel? | Right panel in Figma |
| Can you change text content? | Double-click any text |
| Can you recolor components? | Change fill on any frame |
| Is the schema consistent across different prompts? | Run 3-4 different prompts |
| Does AI output valid JSON every time? | Check terminal for validation errors |

---

## File Structure

```
figma-ai-mvp/
â”œâ”€â”€ schema/
â”‚   â””â”€â”€ index.ts          # Shared Zod schema + TypeScript types
â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ generate.ts        # CLI: calls Claude, validates, saves JSON
â”‚   â””â”€â”€ prompt.ts          # System prompt (the most important file)
â”œâ”€â”€ plugin/
â”‚   â”œâ”€â”€ code.js            # Main thread: creates Figma nodes
â”‚   â””â”€â”€ ui.html            # Plugin UI: paste schema or call AI
â”œâ”€â”€ test-output/           # Generated schemas saved here
â”œâ”€â”€ manifest.json          # Figma plugin manifest
â””â”€â”€ package.json
```

---

## Iterating on Quality

The two files that control output quality:

1. **`scripts/prompt.ts`** â€” Add rules, more examples, tighter constraints
2. **`plugin/code.js`** â†’ `buildSection()` / `buildComponent()` â€” Improve visual rendering

The schema in `schema/index.ts` is the contract between both â€” change it carefully.

---

## Known MVP Limitations

- No real icon support (image placeholders used instead)
- No responsive/mobile frames
- Fonts must be available in your Figma account
- Grid layout uses auto-layout wrap (not true CSS grid)
- No component library â€” all frames are one-off (not instances)

These are all solvable in v2 once the core is validated.

