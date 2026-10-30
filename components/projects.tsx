import { ArrowUpRight01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { HoverLink } from "@/components/hover-link"
import { SectionHeading } from "@/components/section-heading"
import {
  formatStarCount,
  getProjects,
  githubRepoUrl,
  type ProjectWithStars,
} from "@/lib/projects"

function ProjectTitle({ name, linked }: { name: string; linked: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 text-sm font-medium tracking-tight">
      <span className="relative">
        {name}
        {linked ? (
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
        ) : null}
      </span>
      {linked ? (
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={14}
          aria-hidden="true"
          className="translate-y-0.5 self-center text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
    </span>
  )
}

function ProjectMeta({ project }: { project: ProjectWithStars }) {
  if (project.comingSoon) {
    return (
      <span className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
        Soon
      </span>
    )
  }

  if (project.stars === null || !project.repo) {
    return null
  }

  return (
    <a
      href={githubRepoUrl(project.repo)}
      target="_blank"
      rel="noreferrer"
      title={`${project.stars} GitHub stars`}
      aria-label={`${project.name} has ${project.stars} GitHub stars`}
      className="relative z-10 mt-0.5 flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground tabular-nums transition-colors hover:text-foreground"
    >
      <HugeiconsIcon
        icon={StarIcon}
        size={12}
        aria-hidden="true"
        className="opacity-70"
      />
      <span>{formatStarCount(project.stars)}</span>
    </a>
  )
}

function ProjectRow({ project }: { project: ProjectWithStars }) {
  const linked = Boolean(project.href)
  const details = (
    <>
      <ProjectTitle name={project.name} linked={linked} />
      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
    </>
  )

  return (
    <li className="relative">
      <div className="flex items-start justify-between gap-4 py-4">
        <div className="min-w-0">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group block after:absolute after:inset-0"
            >
              {details}
            </a>
          ) : (
            details
          )}
          {project.collab ? (
            <p className="mt-1 text-sm text-muted-foreground">
              In collab with{" "}
              <HoverLink
                href={project.collab.href}
                className="relative z-10 font-medium text-foreground"
              >
                {project.collab.name}
              </HoverLink>
            </p>
          ) : null}
        </div>
        <ProjectMeta project={project} />
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
        action={{
          href: "https://github.com/radiumcoders?tab=repositories",
          label: "All repos",
        }}
      />
      <ul className="mt-4 -mb-4 flex flex-col divide-y divide-dashed divide-border/80 border-t border-dashed border-border/80">
        {items.map((project) => (
          <ProjectRow key={project.repo ?? project.name} project={project} />
        ))}
      </ul>
    </section>
  )
}
