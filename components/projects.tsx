import { SectionHeading } from "@/components/section-heading"
import {
  formatStarCount,
  getProjects,
  githubRepoUrl,
  type ProjectWithStars,
} from "@/lib/projects"
import { cn } from "@/lib/utils"

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("size-3", className)}
    >
      <path
        fill="currentColor"
        d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
      />
    </svg>
  )
}

function ProjectRow({ project }: { project: ProjectWithStars }) {
  return (
    <li className="-mx-2 rounded-md px-2 transition-colors hover:bg-muted/40">
      <div className="flex items-start justify-between gap-4 py-3">
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="group min-w-0"
        >
          <span className="inline-flex items-baseline gap-1.5 text-sm font-medium tracking-tight">
            <span className="relative">
              {project.name}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <span
              aria-hidden="true"
              className="text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              ↗
            </span>
          </span>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </a>
        {project.stars === null ? null : (
          <a
            href={githubRepoUrl(project.repo)}
            target="_blank"
            rel="noreferrer"
            title={`${project.stars} GitHub stars`}
            aria-label={`${project.name} has ${project.stars} GitHub stars`}
            className="mt-0.5 flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground tabular-nums transition-colors hover:text-foreground"
          >
            <StarIcon className="opacity-70" />
            <span>{formatStarCount(project.stars)}</span>
          </a>
        )}
      </div>
    </li>
  )
}

export async function Projects() {
  const items = await getProjects()

  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <SectionHeading
        title="Projects"
        action={{ href: "https://github.com/radiumcoders", label: "GitHub" }}
      />
      <ul className="mt-3 divide-y divide-dashed divide-border border-t border-dashed border-border">
        {items.map((project) => (
          <ProjectRow key={project.repo} project={project} />
        ))}
      </ul>
    </section>
  )
}
