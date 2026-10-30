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

// The centered column every section sits in, framed by solid rails.
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-3xl border-x border-rail">
      {children}
    </div>
  )
}
