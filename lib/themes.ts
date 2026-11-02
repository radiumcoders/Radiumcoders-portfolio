// The colour themes the site defines. "system" follows the OS between them.
export const themes = ["light", "dark"] as const

// The theme toggle and the D key step through these in order.
export const themeCycle = ["light", "dark", "system"] as const

export type ThemeChoice = (typeof themeCycle)[number]

export function nextTheme(current: string | undefined): ThemeChoice {
  const index = themeCycle.indexOf(current as ThemeChoice)
  return themeCycle[(index + 1) % themeCycle.length]
}
