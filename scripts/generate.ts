import Anthropic from "@anthropic-ai/sdk"
import { writeFileSync, mkdirSync } from "fs"
import { UISchemaV1, type UISchema } from "../schema/index.ts"
import { SYSTEM_PROMPT } from "./prompt.ts"

const client = new Anthropic()

// ─── Retry loop — if AI output fails validation, retry up to 3 times ──────────
async function generateWithRetry(prompt: string, maxRetries = 3): Promise<UISchema> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`\n🤖 Attempt ${attempt}/${maxRetries} — calling Claude...`)

    const userMessage = attempt === 1
      ? prompt
      : `${prompt}\n\nPrevious attempt failed validation with error: ${lastError?.message}\nPlease fix the issue and try again. Remember: output ONLY raw JSON, no markdown.`

    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      })

      const raw = message.content
        .filter(b => b.type === "text")
        .map(b => b.type === "text" ? b.text : "")
        .join("")

      // Strip markdown code fences if AI wrapped it anyway
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()

      console.log(`📦 Raw output length: ${cleaned.length} chars`)

      // Parse JSON
      let parsed: unknown
      try {
        parsed = JSON.parse(cleaned)
      } catch (e) {
        throw new Error(`JSON.parse failed: ${e instanceof Error ? e.message : e}`)
      }

      // Validate against Zod schema
      const result = UISchemaV1.safeParse(parsed)
      if (!result.success) {
        const issues = result.error.issues
          .slice(0, 5)
          .map(i => `  [${i.path.join(".")}] ${i.message}`)
          .join("\n")
        throw new Error(`Schema validation failed:\n${issues}`)
      }

      console.log(`✅ Schema valid! ${result.data.sections.length} sections generated.`)
      return result.data

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.error(`❌ Attempt ${attempt} failed: ${lastError.message}`)
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting 2s before retry...`)
        await new Promise(r => setTimeout(r, 2000))
      }
    }
  }

  throw new Error(`All ${maxRetries} attempts failed. Last error: ${lastError?.message}`)
}

// ─── Pretty print schema summary ─────────────────────────────────────────────
function summarizeSchema(schema: UISchema) {
  console.log("\n════════════════════════════════════")
  console.log(`📄 Page: ${schema.page}`)
  console.log(`🎨 Font: ${schema.tokens.fontFamily} | Style: ${schema.tokens.style} | Color: ${schema.tokens.primaryColor}`)
  console.log(`📐 Border Radius: ${schema.tokens.borderRadius}px`)
  console.log(`\n📦 Sections (${schema.sections.length}):`)
  for (const section of schema.sections) {
    const childCount = section.children.length
    const cardCount = section.children.filter(c => c.type === "card").length
    console.log(`  • [${section.type}] layout:${section.layout} children:${childCount}${cardCount > 0 ? ` (${cardCount} cards)` : ""} bg:${section.background ?? "none"}`)
  }
  console.log("════════════════════════════════════\n")
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const prompt = process.argv[2] ?? "Create a modern SaaS landing page for a project management tool called 'Flowly'. Include a navbar, hero section with app screenshot, features section with 3 feature cards, pricing section with 3 tiers, and a footer."

  console.log("════════════════════════════════════")
  console.log("🚀 Figma AI MVP — Schema Generator")
  console.log("════════════════════════════════════")
  console.log(`📝 Prompt: "${prompt}"`)

  const schema = await generateWithRetry(prompt)
  summarizeSchema(schema)

  // Save to test-output/
  mkdirSync("test-output", { recursive: true })
  const filename = `test-output/schema-${Date.now()}.json`
  writeFileSync(filename, JSON.stringify(schema, null, 2), "utf-8")
  console.log(`💾 Schema saved to: ${filename}`)
  console.log(`\n👉 Next step: Copy the contents of ${filename} into the Figma plugin to generate your design.\n`)

  return schema
}

main().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})
