import { z } from "zod"

// ─── Design Tokens ────────────────────────────────────────────────────────────
// AI can only pick FROM these values — never invents raw hex or px values

export const SpacingValue = z.union([
  z.literal(4), z.literal(8), z.literal(12), z.literal(16),
  z.literal(24), z.literal(32), z.literal(48), z.literal(64), z.literal(80),
])

export const FontStyle = z.enum(["display", "h1", "h2", "h3", "body-lg", "body", "caption", "label"])
export const ColorToken = z.enum([
  "primary", "primary-dark", "primary-light",
  "text-primary", "text-secondary", "text-muted", "text-inverse",
  "bg-page", "bg-surface", "bg-surface-raised",
  "border", "border-subtle",
  "success", "warning", "error",
  "white", "black", "transparent"
])

export const DesignTokensSchema = z.object({
  fontFamily: z.enum(["Inter", "Plus Jakarta Sans", "Geist"]),
  borderRadius: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16), z.literal(24)]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  style: z.enum(["minimal", "modern", "bold", "soft"]),
})

// ─── Components (leaf nodes) ──────────────────────────────────────────────────

export const ButtonComponent = z.object({
  type: z.literal("button"),
  label: z.string(),
  variant: z.enum(["primary", "secondary", "ghost", "outline"]),
  size: z.enum(["sm", "md", "lg"]),
})

export const TextComponent = z.object({
  type: z.literal("text"),
  content: z.string(),
  style: FontStyle,
  color: ColorToken,
  align: z.enum(["left", "center", "right"]).optional(),
  maxWidth: z.number().optional(),
})

export const BadgeComponent = z.object({
  type: z.literal("badge"),
  label: z.string(),
  color: ColorToken.optional(),
})

export const ImagePlaceholder = z.object({
  type: z.literal("image"),
  width: z.number(),
  height: z.number(),
  shape: z.enum(["rectangle", "rounded", "circle"]),
  label: z.string().optional(),
})

export const InputComponent = z.object({
  type: z.literal("input"),
  placeholder: z.string(),
  width: z.number().optional(),
})

export const DividerComponent = z.object({
  type: z.literal("divider"),
})

// Card is a container component with children
export const CardComponent = z.object({
  type: z.literal("card"),
  variant: z.enum(["default", "featured", "outlined", "ghost"]).optional(),
  padding: SpacingValue.optional(),
  gap: SpacingValue.optional(),
  children: z.array(z.union([
    ButtonComponent, TextComponent, BadgeComponent,
    ImagePlaceholder, InputComponent, DividerComponent
  ])),
})

export const AnyComponent = z.union([
  ButtonComponent, TextComponent, BadgeComponent,
  ImagePlaceholder, InputComponent, DividerComponent, CardComponent,
])

export type AnyComponent = z.infer<typeof AnyComponent>

// ─── Sections ─────────────────────────────────────────────────────────────────

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(["navbar", "hero", "features", "pricing", "testimonials", "cta", "footer", "faq", "stats", "logos"]),
  layout: z.enum(["vertical", "horizontal", "grid"]).default("vertical"),
  padding: SpacingValue.optional(),
  gap: SpacingValue.optional(),
  columns: z.number().min(1).max(6).optional(),
  background: ColorToken.optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  children: z.array(AnyComponent),
})

// ─── Top-level Page Schema ────────────────────────────────────────────────────

export const UISchemaV1 = z.object({
  schemaVersion: z.literal("1.0"),
  page: z.string(),
  description: z.string(),
  tokens: DesignTokensSchema,
  sections: z.array(SectionSchema).min(1).max(10),
})

export type UISchema = z.infer<typeof UISchemaV1>
export type Section = z.infer<typeof SectionSchema>
export type DesignTokens = z.infer<typeof DesignTokensSchema>
export type ButtonComponent = z.infer<typeof ButtonComponent>
export type TextComponent = z.infer<typeof TextComponent>
export type CardComponent = z.infer<typeof CardComponent>
export type ImagePlaceholder = z.infer<typeof ImagePlaceholder>
