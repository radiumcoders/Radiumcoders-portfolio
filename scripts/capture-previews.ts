import { mkdir } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

import { chromium } from "playwright-core"

import { previewSrc, projects } from "../lib/projects.ts"

const VIEWPORT = { width: 1280, height: 800 }
const SETTLE_MS = 2500
// Captured at 2x so the hover card stays sharp on retina screens.
const SCALE = 2

// Uses an installed Chromium (e.g. from `npx playwright install chromium`).
// Point CHROMIUM_PATH at a different binary if needed.
const executablePath =
  process.env.CHROMIUM_PATH ??
  join(
    homedir(),
    ".cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
  )

const only = process.argv.slice(2).map((name) => name.toLowerCase())
const targets = projects.filter(
  (project) =>
    project.href &&
    project.previewUrl !== false &&
    (only.length === 0 || only.includes(project.name.toLowerCase()))
)

await mkdir("public/previews", { recursive: true })

const browser = await chromium.launch({ executablePath })
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: SCALE,
  colorScheme: "dark",
})

for (const project of targets) {
  const page = await context.newPage()
  const path = join("public", previewSrc(project))

  try {
    await page.goto(project.previewUrl || project.href!, {
      waitUntil: "networkidle",
      timeout: 30_000,
    })
    await page.waitForTimeout(SETTLE_MS)
    await page.screenshot({ path, type: "jpeg", quality: 92 })
    console.log(`✓ ${project.name} → ${path}`)
  } catch (error) {
    console.error(`✗ ${project.name}: ${(error as Error).message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
