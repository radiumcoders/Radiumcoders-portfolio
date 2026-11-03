"use client"

import Link from "next/link"

import { Diya } from "@/components/diyas"
import { useDiwali } from "@/hooks/use-diwali"

// A small wish beside the greeting, shown only during Diwali week. It leads
// to the rooftop where visitors can burst crackers.
export function DiwaliWish() {
  const diwali = useDiwali()
  if (!diwali) return null

  return (
    <Link
      href="/diwali"
      title="Burst some crackers"
      className="group/link relative inline-flex animate-in items-center gap-1 text-sm text-muted-foreground transition-colors duration-700 fade-in slide-in-from-left-1 hover:text-foreground"
    >
      Happy Diwali
      <Diya className="w-4" />
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
    </Link>
  )
}
