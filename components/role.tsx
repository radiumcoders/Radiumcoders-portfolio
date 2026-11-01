const corners = [
  "-top-[3px] -left-[3px]",
  "-top-[3px] -right-[3px]",
  "-bottom-[3px] -left-[3px]",
  "-right-[3px] -bottom-[3px]",
]

// "Design" gets a selection frame like a canvas tool; "engineer" drops a
// little code window with a blinking caret.
export function Role() {
  return (
    <span className="group/role cursor-default">
      <span className="relative inline-block">
        Design
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-1 -inset-y-px scale-110 border border-foreground/70 opacity-0 transition duration-200 ease-out group-hover/role:scale-100 group-hover/role:opacity-100 motion-reduce:scale-100"
        >
          {corners.map((corner) => (
            <span
              key={corner}
              className={`absolute size-[5px] border border-foreground bg-background ${corner}`}
            />
          ))}
        </span>
      </span>{" "}
      <span className="relative inline-block">
        engineer
        <span
          aria-hidden
          className="pointer-events-none absolute top-full left-1/2 mt-1 origin-top -translate-x-1/2 -translate-y-1.5 scale-50 opacity-0 transition delay-75 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/role:translate-y-0 group-hover/role:scale-100 group-hover/role:rotate-6 group-hover/role:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-opacity"
        >
          <svg
            viewBox="0 0 32 22"
            className="block w-8 fill-background stroke-current stroke-[1.25] text-foreground"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="1" width="30" height="20" rx="3" />
            <path d="M1 6.5h30" fill="none" />
            {[5, 8, 11].map((cx) => (
              <circle
                key={cx}
                cx={cx}
                cy={3.75}
                r={0.9}
                className="fill-current stroke-none"
              />
            ))}
            <path
              d="M11 11l-3 3 3 3M16.5 10l-2.5 8M19.5 11l3 3-3 3"
              fill="none"
            />
            <path
              d="M25.5 11v6"
              className="group-hover/role:animate-caret motion-reduce:animate-none!"
            />
          </svg>
        </span>
      </span>
    </span>
  )
}
