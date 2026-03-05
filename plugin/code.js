// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Figma Plugin Main Thread Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// This runs in the Figma sandbox Ã¢â‚¬â€ has access to figma.* APIs
// Receives schema from UI thread via messages

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Design Token Resolution Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function coalesce(value, fallback) {
  return value === null || value === undefined ? fallback : value
}

function resolveColor(token, primaryHex) {
  // Convert primary hex to RGB
  const pr = parseInt(primaryHex.slice(1,3), 16) / 255
  const pg = parseInt(primaryHex.slice(3,5), 16) / 255
  const pb = parseInt(primaryHex.slice(5,7), 16) / 255

  const map = {
    "primary":         { r: pr, g: pg, b: pb },
    "primary-dark":    { r: pr * 0.75, g: pg * 0.75, b: pb * 0.75 },
    "primary-light":   { r: Math.min(1, pr * 1.4 + 0.4), g: Math.min(1, pg * 1.4 + 0.4), b: Math.min(1, pb * 1.4 + 0.4) },
    "text-primary":    { r: 0.071, g: 0.082, b: 0.118 },
    "text-secondary":  { r: 0.369, g: 0.400, b: 0.490 },
    "text-muted":      { r: 0.580, g: 0.604, b: 0.671 },
    "text-inverse":    { r: 1, g: 1, b: 1 },
    "bg-page":         { r: 0.976, g: 0.976, b: 0.988 },
    "bg-surface":      { r: 1, g: 1, b: 1 },
    "bg-surface-raised": { r: 0.992, g: 0.992, b: 1 },
    "border":          { r: 0.878, g: 0.886, b: 0.910 },
    "border-subtle":   { r: 0.937, g: 0.941, b: 0.957 },
    "success":         { r: 0.133, g: 0.706, b: 0.404 },
    "warning":         { r: 0.961, g: 0.620, b: 0.000 },
    "error":           { r: 0.937, g: 0.267, b: 0.267 },
    "white":           { r: 1, g: 1, b: 1 },
    "black":           { r: 0, g: 0, b: 0 },
    "transparent":     null,
  }
  return coalesce(map[token], { r: 0, g: 0, b: 0 })
}

function resolveFontSize(style) {
  const map = {
    "display": 56, "h1": 40, "h2": 32, "h3": 24,
    "body-lg": 18, "body": 16, "caption": 13, "label": 12,
  }
  return coalesce(map[style], 16)
}

function resolveFontWeight(style) {
  return ["display", "h1", "h2", "h3", "label"].includes(style) ? "Bold" : "Regular"
}

function resolveLineHeight(style) {
  const map = {
    "display": 1.15, "h1": 1.2, "h2": 1.25, "h3": 1.3,
    "body-lg": 1.6, "body": 1.6, "caption": 1.5, "label": 1.4,
  }
  return coalesce(map[style], 1.5)
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Font Loading Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

async function loadFonts(fontFamily) {
  await figma.loadFontAsync({ family: fontFamily, style: "Regular" })
  await figma.loadFontAsync({ family: fontFamily, style: "Bold" })
  await figma.loadFontAsync({ family: fontFamily, style: "Medium" })
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Component Builders Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function buildTextNode(comp, tokens) {
  const text = figma.createText()
  text.fontName = {
    family: tokens.fontFamily,
    style: resolveFontWeight(comp.style)
  }
  text.characters = comp.content
  text.fontSize = resolveFontSize(comp.style)

  const lh = resolveLineHeight(comp.style)
  text.lineHeight = { value: lh * 100, unit: "PERCENT" }
  text.letterSpacing = ["display","h1"].includes(comp.style)
    ? { value: -1.5, unit: "PERCENT" }
    : { value: 0, unit: "PERCENT" }

  const color = resolveColor(comp.color, tokens.primaryColor)
  if (color) text.fills = [{ type: "SOLID", color }]

  if (comp.align) {
    const alignMap = { left: "LEFT", center: "CENTER", right: "RIGHT" }
    text.textAlignHorizontal = coalesce(alignMap[comp.align], "LEFT")
  }

  if (comp.maxWidth) {
    text.textAutoResize = "HEIGHT"
    text.resize(comp.maxWidth, text.height)
  } else {
    text.textAutoResize = "WIDTH_AND_HEIGHT"
  }

  text.name = `Text/${comp.style}`
  return text
}

function buildButtonNode(comp, tokens) {
  const frame = figma.createFrame()
  frame.name = `Button/${comp.variant}`
  frame.layoutMode = "HORIZONTAL"
  frame.primaryAxisAlignItems = "CENTER"
  frame.counterAxisAlignItems = "CENTER"
  frame.primaryAxisSizingMode = "AUTO"
  frame.counterAxisSizingMode = "AUTO"

  const sizeMap = { sm: [12, 20], md: [16, 24], lg: [20, 32] }
  const size = coalesce(sizeMap[comp.size], [16, 24])
  const py = size[0]
  const px = size[1]
  frame.paddingTop = py
  frame.paddingBottom = py
  frame.paddingLeft = px
  frame.paddingRight = px
  frame.cornerRadius = tokens.borderRadius

  const primaryColor = resolveColor("primary", tokens.primaryColor)

  if (comp.variant === "primary") {
    frame.fills = [{ type: "SOLID", color: primaryColor }]
  } else if (comp.variant === "secondary") {
    const lightColor = resolveColor("primary-light", tokens.primaryColor)
    frame.fills = [{ type: "SOLID", color: lightColor }]
  } else if (comp.variant === "outline") {
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
    frame.strokes = [{ type: "SOLID", color: resolveColor("border", tokens.primaryColor) }]
    frame.strokeWeight = 1.5
  } else {
    frame.fills = []
  }

  // Label text
  const label = figma.createText()
  label.fontName = { family: tokens.fontFamily, style: "Bold" }
  label.characters = comp.label
  const fontSizeMap = { sm: 13, md: 15, lg: 16 }
  label.fontSize = coalesce(fontSizeMap[comp.size], 15)
  label.textAutoResize = "WIDTH_AND_HEIGHT"

  if (comp.variant === "primary") {
    label.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
  } else if (comp.variant === "secondary") {
    label.fills = [{ type: "SOLID", color: primaryColor }]
  } else {
    label.fills = [{ type: "SOLID", color: resolveColor("text-primary", tokens.primaryColor) }]
  }

  frame.appendChild(label)
  return frame
}

function buildBadgeNode(comp, tokens) {
  const frame = figma.createFrame()
  frame.name = `Badge/${comp.label}`
  frame.layoutMode = "HORIZONTAL"
  frame.primaryAxisAlignItems = "CENTER"
  frame.counterAxisAlignItems = "CENTER"
  frame.primaryAxisSizingMode = "AUTO"
  frame.counterAxisSizingMode = "AUTO"
  frame.paddingTop = 4
  frame.paddingBottom = 4
  frame.paddingLeft = 12
  frame.paddingRight = 12
  frame.cornerRadius = 999

  const bgColor = resolveColor(coalesce(comp.color, "primary-light"), tokens.primaryColor)
  frame.fills = [{ type: "SOLID", color: bgColor }]

  const label = figma.createText()
  label.fontName = { family: tokens.fontFamily, style: "Bold" }
  label.characters = comp.label
  label.fontSize = 12
  label.textAutoResize = "WIDTH_AND_HEIGHT"
  label.fills = [{ type: "SOLID", color: resolveColor("primary", tokens.primaryColor) }]
  label.letterSpacing = { value: 2, unit: "PERCENT" }

  frame.appendChild(label)
  return frame
}

function buildImagePlaceholder(comp, tokens) {
  const frame = figma.createFrame()
  frame.name = coalesce(comp.label, "Image")
  frame.resize(comp.width, comp.height)
  frame.cornerRadius = comp.shape === "circle" ? 9999
    : comp.shape === "rounded" ? tokens.borderRadius * 1.5
    : 0

  frame.fills = [{ type: "SOLID", color: { r: 0.929, g: 0.929, b: 0.949 } }]

  // Label text in center
  const label = figma.createText()
  label.fontName = { family: tokens.fontFamily, style: "Regular" }
  label.characters = coalesce(comp.label, "Image")
  label.fontSize = 13
  label.textAutoResize = "WIDTH_AND_HEIGHT"
  label.fills = [{ type: "SOLID", color: { r: 0.580, g: 0.604, b: 0.671 } }]

  // Center the label
  frame.appendChild(label)
  label.x = (comp.width - label.width) / 2
  label.y = (comp.height - label.height) / 2

  return frame
}

function buildInputNode(comp, tokens) {
  const frame = figma.createFrame()
  frame.name = "Input"
  frame.layoutMode = "HORIZONTAL"
  frame.primaryAxisAlignItems = "CENTER"
  frame.counterAxisAlignItems = "CENTER"
  frame.primaryAxisSizingMode = "FIXED"
  frame.counterAxisSizingMode = "AUTO"
  frame.resize(coalesce(comp.width, 320), 44)
  frame.paddingLeft = 16
  frame.paddingRight = 16
  frame.cornerRadius = tokens.borderRadius
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
  frame.strokes = [{ type: "SOLID", color: resolveColor("border", tokens.primaryColor) }]
  frame.strokeWeight = 1.5

  const placeholder = figma.createText()
  placeholder.fontName = { family: tokens.fontFamily, style: "Regular" }
  placeholder.characters = comp.placeholder
  placeholder.fontSize = 15
  placeholder.textAutoResize = "WIDTH_AND_HEIGHT"
  placeholder.fills = [{ type: "SOLID", color: resolveColor("text-muted", tokens.primaryColor) }]
  frame.appendChild(placeholder)
  return frame
}

function buildDividerNode(tokens) {
  const frame = figma.createFrame()
  frame.name = "Divider"
  frame.resize(400, 1)
  frame.fills = [{ type: "SOLID", color: resolveColor("border-subtle", tokens.primaryColor) }]
  return frame
}

function buildCardNode(comp, tokens) {
  const frame = figma.createFrame()
  frame.name = `Card/${coalesce(comp.variant, "default")}`
  frame.layoutMode = "VERTICAL"
  frame.primaryAxisSizingMode = "AUTO"
  frame.counterAxisSizingMode = "FIXED"
  frame.resize(340, 100)

  const pad = coalesce(comp.padding, 32)
  frame.paddingTop = pad
  frame.paddingBottom = pad
  frame.paddingLeft = pad
  frame.paddingRight = pad
  frame.itemSpacing = coalesce(comp.gap, 16)
  frame.cornerRadius = tokens.borderRadius * 1.5

  if (comp.variant === "featured") {
    const primary = resolveColor("primary", tokens.primaryColor)
    // Subtle tinted background for featured
    frame.fills = [{
      type: "SOLID",
      color: {
        r: Math.min(1, primary.r * 0.08 + 0.93),
        g: Math.min(1, primary.g * 0.08 + 0.93),
        b: Math.min(1, primary.b * 0.08 + 0.93)
      }
    }]
    frame.strokes = [{ type: "SOLID", color: resolveColor("primary", tokens.primaryColor) }]
    frame.strokeWeight = 2
  } else if (comp.variant === "outlined") {
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
    frame.strokes = [{ type: "SOLID", color: resolveColor("border", tokens.primaryColor) }]
    frame.strokeWeight = 1.5
  } else {
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
    // Subtle shadow effect via stroke
    frame.strokes = [{ type: "SOLID", color: resolveColor("border-subtle", tokens.primaryColor) }]
    frame.strokeWeight = 1
  }

  // Build children
  for (const child of comp.children) {
    const node = buildComponent(child, tokens)
    if (node) frame.appendChild(node)
  }

  return frame
}

function buildComponent(comp, tokens) {
  switch (comp.type) {
    case "text":    return buildTextNode(comp, tokens)
    case "button":  return buildButtonNode(comp, tokens)
    case "badge":   return buildBadgeNode(comp, tokens)
    case "image":   return buildImagePlaceholder(comp, tokens)
    case "input":   return buildInputNode(comp, tokens)
    case "divider": return buildDividerNode(tokens)
    case "card":    return buildCardNode(comp, tokens)
    default:        return null
  }
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Section Builder Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function buildSection(section, tokens) {
  const frame = figma.createFrame()
  frame.name = `Section/${section.type}`

  const bgColor = resolveColor(coalesce(section.background, "bg-page"), tokens.primaryColor)
  if (bgColor) {
    frame.fills = [{ type: "SOLID", color: bgColor }]
  } else {
    frame.fills = []
  }

  // Grid sections use HORIZONTAL layout with wrapping
  const isGrid = section.layout === "grid" && section.columns && section.columns > 1

  if (isGrid) {
    // Use horizontal auto-layout, children size themselves
    frame.layoutMode = "HORIZONTAL"
    frame.primaryAxisSizingMode = "FIXED"
    frame.counterAxisSizingMode = "AUTO"
    frame.layoutWrap = "WRAP"
    frame.resize(1440, 100)
    frame.paddingTop = coalesce(section.padding, 64)
    frame.paddingBottom = coalesce(section.padding, 64)
    frame.paddingLeft = coalesce(section.padding, 80)
    frame.paddingRight = coalesce(section.padding, 80)
    frame.itemSpacing = coalesce(section.gap, 24)
    frame.counterAxisSpacing = coalesce(section.gap, 24)
    frame.primaryAxisAlignItems = "CENTER"
    frame.counterAxisAlignItems = "MIN"
  } else {
    frame.layoutMode = section.layout === "horizontal" ? "HORIZONTAL" : "VERTICAL"
    frame.primaryAxisSizingMode = "AUTO"
    frame.counterAxisSizingMode = "FIXED"
    frame.resize(1440, 100)
    frame.paddingTop = coalesce(section.padding, 64)
    frame.paddingBottom = coalesce(section.padding, 64)
    frame.paddingLeft = coalesce(section.padding, 80)
    frame.paddingRight = coalesce(section.padding, 80)
    frame.itemSpacing = coalesce(section.gap, 24)

    if (section.align === "center") {
      frame.primaryAxisAlignItems = "CENTER"
      frame.counterAxisAlignItems = "CENTER"
    } else if (section.align === "right") {
      frame.counterAxisAlignItems = "MAX"
    } else {
      frame.primaryAxisAlignItems = "MIN"
      if (section.layout === "horizontal") {
        frame.counterAxisAlignItems = "CENTER"
      }
    }
  }

  // Navbar: space-between for logo + links + CTA
  if (section.type === "navbar") {
    frame.primaryAxisAlignItems = "SPACE_BETWEEN"
    frame.counterAxisAlignItems = "CENTER"
    frame.paddingTop = 0
    frame.paddingBottom = 0
    frame.resize(1440, coalesce(section.padding, 80))
    frame.counterAxisSizingMode = "FIXED"
    frame.primaryAxisSizingMode = "FIXED"
  }

  for (const child of section.children) {
    const node = buildComponent(child, tokens)
    if (!node) continue

    // In grid sections, set fixed width for cards
    if (isGrid && node.type === "FRAME") {
      const cols = coalesce(section.columns, 3)
      const totalPadding = coalesce(section.padding, 80) * 2
      const totalGap = coalesce(section.gap, 24) * (cols - 1)
      const cardWidth = Math.floor((1440 - totalPadding - totalGap) / cols)
      node.layoutSizingHorizontal = "FIXED"
      node.resize(cardWidth, node.height)
    }

    frame.appendChild(node)
  }

  return frame
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Main Page Generator Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

async function generatePage(schema) {
  const page = figma.currentPage
  page.name = schema.page

  await loadFonts(schema.tokens.fontFamily)

  // Clear existing content
  for (const node of [...page.children]) node.remove()

  let yOffset = 0
  const pageFrame = figma.createFrame()
  pageFrame.name = schema.page
  pageFrame.layoutMode = "VERTICAL"
  pageFrame.primaryAxisSizingMode = "AUTO"
  pageFrame.counterAxisSizingMode = "AUTO"
  pageFrame.itemSpacing = 0
  pageFrame.fills = [{ type: "SOLID", color: resolveColor("bg-page", schema.tokens.primaryColor) }]
  pageFrame.resize(1440, 100)

  for (const section of schema.sections) {
    const sectionFrame = buildSection(section, schema.tokens)
    pageFrame.appendChild(sectionFrame)
  }

  page.appendChild(pageFrame)
  figma.viewport.scrollAndZoomIntoView([pageFrame])

  return pageFrame
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Message Handler Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

figma.showUI(__html__, { width: 480, height: 600, title: "Figma AI MVP" })

figma.ui.onmessage = async (msg) => {
  if (msg.type === "GENERATE") {
    try {
      figma.ui.postMessage({ type: "STATUS", message: "Generating design..." })
      const frame = await generatePage(msg.schema)
      figma.ui.postMessage({ type: "SUCCESS", message: `Ã¢Å“â€¦ Generated ${msg.schema.sections.length} sections!` })
      figma.notify(`Ã¢Å“â€¦ Design generated Ã¢â‚¬â€ ${msg.schema.sections.length} sections`, { timeout: 3000 })
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      figma.ui.postMessage({ type: "ERROR", message: error })
      figma.notify(`Ã¢ÂÅ’ Error: ${error}`, { error: true })
    }
  }

  if (msg.type === "CLOSE") {
    figma.closePlugin()
  }
}
