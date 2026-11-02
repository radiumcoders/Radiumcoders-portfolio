import type { ReactNode } from "react"

// The centered column every section sits in. It is frosted glass over the
// shader background: the colour blurs through, softly enough to read over.
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl bg-background/75 backdrop-blur-2xl">
      {children}
    </div>
  )
}
