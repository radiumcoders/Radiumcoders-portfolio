import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

import { testimonials } from "../lib/testimonials.ts"

// Re-downloads testimonial avatars into public/avatars/ so the page never
// depends on X's image URLs, which break whenever someone changes their photo.
const only = process.argv.slice(2).map((handle) => handle.toLowerCase())
const targets = testimonials.filter(
  (item) =>
    item.avatar.startsWith("/avatars/") &&
    (only.length === 0 || only.includes(item.handle.toLowerCase()))
)

await mkdir("public/avatars", { recursive: true })

for (const item of targets) {
  const url = `https://unavatar.io/x/${item.handle}?fallback=false`

  try {
    const response = await fetch(url)
    const type = response.headers.get("content-type") ?? ""

    if (!response.ok || !type.startsWith("image/")) {
      throw new Error(`${response.status} ${type}`)
    }

    await writeFile(
      join("public", item.avatar),
      Buffer.from(await response.arrayBuffer())
    )
    console.log(`✓ @${item.handle} → public${item.avatar}`)
  } catch (error) {
    console.error(`✗ @${item.handle}: ${(error as Error).message}`)
  }
}
