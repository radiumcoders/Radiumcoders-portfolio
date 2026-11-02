import { cn } from "@/lib/utils"

// Springs a little drawing out from under a word while its group is hovered.
const sticker =
  "pointer-events-none absolute top-full left-1/2 mt-1 origin-top -translate-x-1/2 -translate-y-1.5 scale-50 opacity-0 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-opacity"

// Radium glows and shows its periodic table tile.
function Radium() {
  return (
    <span className="group/ra relative inline-block cursor-default text-foreground transition-[color,text-shadow] duration-300 hover:text-crayon-green hover:[text-shadow:0_0_10px_currentColor]">
      Radium
      <span
        aria-hidden
        className={cn(
          sticker,
          "group-hover/ra:translate-y-0 group-hover/ra:scale-100 group-hover/ra:-rotate-6 group-hover/ra:opacity-100 group-hover/ra:[text-shadow:none]"
        )}
      >
        <svg
          viewBox="0 0 26 30"
          className="block w-6.5 fill-[color-mix(in_oklab,currentColor_14%,var(--background))] stroke-current stroke-[1.25] text-crayon-green"
        >
          <rect x="1" y="1" width="24" height="28" rx="2.5" />
          <g className="fill-current stroke-none">
            <text x="4" y="8" fontSize="5.5">
              88
            </text>
            <text x="13" y="20" fontSize="11" textAnchor="middle">
              Ra
            </text>
            <text x="13" y="26" fontSize="4.5" textAnchor="middle">
              226
            </text>
          </g>
        </svg>
      </span>
    </span>
  )
}

// radiumcoders spins up an atom.
function Radiumcoders() {
  return (
    <span className="group/rc relative inline-block cursor-default text-foreground transition-colors duration-300 hover:text-crayon-cyan">
      radiumcoders
      <span
        aria-hidden
        className={cn(
          sticker,
          "group-hover/rc:translate-y-0 group-hover/rc:scale-100 group-hover/rc:opacity-100"
        )}
      >
        <svg
          viewBox="0 0 30 30"
          className="block w-7.5 fill-none stroke-current stroke-[1.1] text-crayon-cyan"
        >
          <circle
            cx="15"
            cy="15"
            r="14"
            className="fill-[color-mix(in_oklab,currentColor_14%,var(--background))] stroke-none"
          />
          <g className="origin-[15px_15px] [transform-box:view-box] group-hover/rc:animate-[spin_4s_linear_infinite] motion-reduce:animate-none!">
            {[0, 60, 120].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 15 15)`}>
                <ellipse cx="15" cy="15" rx="12" ry="4.5" />
                <circle
                  cx="27"
                  cy="15"
                  r="1.4"
                  className="fill-current stroke-none"
                />
              </g>
            ))}
          </g>
          <circle
            cx="15"
            cy="15"
            r="2.25"
            className="fill-current stroke-none"
          />
        </svg>
      </span>
    </span>
  )
}

export function Aka() {
  return (
    <>
      aka <Radium /> or <Radiumcoders />
    </>
  )
}
