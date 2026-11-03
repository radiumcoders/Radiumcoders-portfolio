"use client"

import { useSyncExternalStore } from "react"

import { isDiwali } from "@/lib/festive"

const subscribe = () => () => {}

// `?diwali` turns festive mode on outside the dates, and `?diwali=off` turns
// it off inside them, so it can be previewed or checked either way.
function getSnapshot() {
  const override = new URLSearchParams(window.location.search).get("diwali")
  if (override === null) return isDiwali()
  return override !== "off" && override !== "0"
}

// The page is static, so the date is only checked in the browser. The server
// renders it switched off and the client turns it on after hydration.
export function useDiwali() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
