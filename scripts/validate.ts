import { readFileSync } from "fs"
import { UISchemaV1 } from "../schema/index.ts"

function main() {
  const path = process.argv[2]
  if (!path) {
    console.error("Usage: npm run validate -- <path-to-schema.json>")
    process.exit(1)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, "utf-8"))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`Failed to read/parse JSON: ${message}`)
    process.exit(1)
  }

  const result = UISchemaV1.safeParse(parsed)
  if (!result.success) {
    console.error("Schema validation failed:")
    for (const issue of result.error.issues.slice(0, 20)) {
      console.error(`- [${issue.path.join(".")}] ${issue.message}`)
    }
    process.exit(1)
  }

  console.log(`Schema valid: ${path}`)
  console.log(`Sections: ${result.data.sections.length}`)
}

main()
