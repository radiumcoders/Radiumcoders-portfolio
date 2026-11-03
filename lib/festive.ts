// The days the site dresses up for Diwali, in the visitor's local time: from
// a few days before Lakshmi Puja through Bhai Dooj. Add next year's dates here
// once they're confirmed.
const DIWALI = [
  // Lakshmi Puja falls on Sunday 8 November 2026.
  { from: "2026-11-05", to: "2026-11-12" },
]

function localDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function isDiwali(date = new Date()) {
  const today = localDay(date)
  return DIWALI.some(({ from, to }) => from <= today && today <= to)
}
