// The theme toggle and the D key step through these in order.
export const themes = ["light", "dark", "blueprint"] as const

export function nextTheme(current: string | undefined) {
  const index = themes.indexOf(current as (typeof themes)[number])
  return themes[(index + 1) % themes.length]
}
