import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function HoverLink({
  className,
  children,
  ...props
}: ComponentProps<"a">) {
  const external = typeof props.href === "string" && /^https?:\/\//.test(props.href)

  return (
    <a
      className={cn("group/link relative", className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
    </a>
  )
}
