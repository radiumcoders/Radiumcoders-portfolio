import type { ReactNode } from "react"

// The centered column every section sits in. It sits above the shader
// background and covers it.
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl bg-background">
      {children}
    </div>
  )
}
