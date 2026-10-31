import type { ReactNode } from "react"

// A full-width line. It breaks out of the Frame to span the whole screen.
export function Rule() {
  return (
    <div
      aria-hidden="true"
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2 border-t border-rail"
    />
  )
}

// The centered column every section sits in, framed by solid rails. It sits
// above the shader background and covers it.
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl border-x border-rail bg-background">
      {children}
    </div>
  )
}
