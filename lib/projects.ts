export type Project = {
  name: string
  description: string
  href: string
  repo: string
}

export type ProjectWithStars = Project & {
  stars: number | null
}

const REVALIDATE_SECONDS = 20 * 60

export const projects: Project[] = [
  {
    name: "23rd.dev",
    description:
      "Opinionated UI components for shippers. Framework-agnostic. Copy, paste, ship.",
    href: "https://23rd.dev",
    repo: "radiumcoders/23rd.dev",
  },
  {
    name: "EvilButtons",
    description:
      "Playful animated buttons with evil aesthetics and killing interactions.",
    href: "https://evilbuttons.com",
    repo: "radiumcoders/Evil-Buttons",
  },
  {
    name: "Github Contribution City",
    description:
      "Turn any GitHub profile into an interactive 3D isometric contribution city.",
    href: "https://isometric-github-contributions.vercel.app",
    repo: "radiumcoders/Isometric-Github-Contributions",
  },
  {
    name: "Ride Your Github Contributions",
    description:
      "Ride your contribution graph as ice terrain, with physics.",
    href: "https://rygc.vercel.app",
    repo: "radiumcoders/rygc",
  },
  {
    name: "StarWalls",
    description:
      "Generate a short video of a GitHub repo's stargazers.",
    href: "https://starwall.radiumcoders.com",
    repo: "radiumcoders/github-stars",
  },
]

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "radiumcoders-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  const token = process.env.GITHUB_TOKEN

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function fetchStarCount(repo: string) {
  const response = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch stars for ${repo} (${response.status})`)
  }

  const data = (await response.json()) as { stargazers_count?: number }

  return typeof data.stargazers_count === "number" ? data.stargazers_count : null
}

export function githubRepoUrl(repo: string) {
  return `https://github.com/${repo}`
}

export function formatStarCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: count >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(count)
}

export async function getProjects(): Promise<ProjectWithStars[]> {
  const stars = await Promise.all(
    projects.map(async (project) => {
      try {
        return await fetchStarCount(project.repo)
      } catch {
        return null
      }
    })
  )

  return projects.map((project, index) => ({
    ...project,
    stars: stars[index],
  }))
}
