import { cn } from "@/lib/utils"

const sparkles = [
  { className: "-top-2 -right-3 size-2.5", delay: 0 },
  { className: "-right-4 bottom-0.5 size-1.5", delay: 120 },
  { className: "-top-1.5 -left-2 size-1.5", delay: 240 },
]

// "Hi" waves with a couple of motion arcs; "Jay" catches a few sparkles.
export function Greeting() {
  return (
    <h1 className="text-lg font-medium tracking-tight">
      <span className="group/hi relative inline-block cursor-default">
        <span className="inline-block origin-[30%_90%] group-hover/hi:animate-wave motion-reduce:animate-none!">
          Hi
        </span>
        <svg
          aria-hidden
          viewBox="0 0 8 14"
          className="pointer-events-none absolute top-0.5 -left-2.5 h-3.5 fill-none stroke-current stroke-[1.25] text-muted-foreground"
          strokeLinecap="round"
        >
          {["M7 2.5a6 6 0 0 0 0 9", "M4 1a8.5 8.5 0 0 0 0 12"].map(
            (d, index) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="transition-[stroke-dashoffset] duration-300 ease-out [stroke-dasharray:1] [stroke-dashoffset:1] group-hover/hi:[stroke-dashoffset:0]"
                style={{ transitionDelay: `${index * 100}ms` }}
              />
            )
          )}
        </svg>
      </span>
      , I&apos;m{" "}
      <span className="group/jay relative inline-block cursor-default">
        Jay
        {sparkles.map(({ className, delay }) => (
          <span
            key={delay}
            aria-hidden
            className={cn(
              "pointer-events-none absolute scale-0 -rotate-90 opacity-0 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/jay:scale-100 group-hover/jay:rotate-0 group-hover/jay:opacity-100 motion-reduce:transition-opacity",
              className
            )}
            style={{ transitionDelay: `${delay}ms` }}
          >
            <svg
              viewBox="0 0 10 10"
              className="block size-full fill-current group-hover/jay:animate-twinkle motion-reduce:animate-none!"
              style={{ animationDelay: `${delay + 300}ms` }}
            >
              <path d="M5 0c.4 3.2 1.8 4.6 5 5-3.2.4-4.6 1.8-5 5-.4-3.2-1.8-4.6-5-5 3.2-.4 4.6-1.8 5-5z" />
            </svg>
          </span>
        ))}
      </span>
    </h1>
  )
}
