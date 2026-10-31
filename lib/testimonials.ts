export type Testimonial = {
  name: string
  handle: string
  avatar: string
  quote: string
  href: string
  followers: number
  verified?: boolean
}

export const testimonials: Testimonial[] = [
  {
    name: "Nil . Dev .",
    handle: "Nil_phy_dreamer",
    avatar: "/avatars/nil_phy_dreamer.jpg",
    quote:
      "An amazing guy with lots of beautiful stuff out there for the community.",
    href: "https://x.com/Nil_phy_dreamer/status/2089336495970668921",
    followers: 306,
    verified: true,
  },
  {
    name: "VidStudio",
    handle: "useVidStudio",
    avatar: "/avatars/usevidstudio.jpg",
    quote: "Best beta tester out there, ngl",
    href: "https://x.com/useVidStudio/status/2072662324318797981",
    followers: 10,
  },
  {
    name: "Bob⚡James",
    handle: "init_bobjames",
    avatar: "/avatars/init_bobjames.jpg",
    quote:
      "that's wild Jay loving your UI elements 🤩\n\nalso clicked it and there is no undo 🤣",
    href: "https://x.com/init_bobjames/status/2085235206647173314",
    followers: 4482,
    verified: true,
  },
  {
    name: "Dhruv",
    handle: "dhruvtwt_",
    avatar: "/avatars/dhruvtwt_.jpg",
    quote: "Love u jay 😍",
    href: "https://x.com/dhruvtwt_/status/2085064655240929526",
    followers: 6939,
    verified: true,
  },
  {
    name: "Matthew Parris",
    handle: "parrisdigital",
    avatar: "/avatars/parrisdigital.jpg",
    quote: "You're killing it @radiumcoders ! Looks amazing!",
    href: "https://x.com/parrisdigital/status/2084650850266370479",
    followers: 347,
    verified: true,
  },
  {
    name: "Massi — oss/acc",
    handle: "0xMassi",
    avatar: "/avatars/0xmassi.jpg",
    quote:
      "I really love this guy, so talented and always available. Be sure to follow him and don’t miss his work",
    href: "https://x.com/0xMassi/status/2084637478447730777",
    followers: 1237,
    verified: true,
  },
  {
    name: "Active Builders",
    handle: "active_builders",
    avatar: "/avatars/active_builders.jpg",
    quote:
      "Welcome @radiumcoders!\n\nJay is the creator of evilbuttons.com, a collection of buttons you didn't know you needed!\n\nFollow him!",
    href: "https://x.com/active_builders/status/2084611061370794297",
    followers: 7043,
    verified: true,
  },
  {
    name: "Jon C. Phillips",
    handle: "joncphillips",
    avatar: "/avatars/joncphillips.jpg",
    quote:
      "Man this is cool! evilbuttons.com been clicking buttons for a few minutes and actually enjoying it. Made by @radiumcoders 🔥",
    href: "https://x.com/joncphillips/status/2083611886319181917",
    followers: 10741,
    verified: true,
  },
  {
    name: "Brilliant Insane",
    handle: "brill_insane",
    avatar: "/avatars/brill_insane.jpg",
    quote:
      "It's fire, Jay! Good job! Really like the @orcdev Burj Khalifa in the middle of New York :D",
    href: "https://x.com/brill_insane/status/2074837377936195884",
    followers: 121,
    verified: true,
  },
  {
    name: "Evil Rabbit",
    handle: "evilrabbit_",
    avatar: "/avatars/evilrabbit_.jpg",
    quote: "Great job Jay! 🙌",
    href: "https://x.com/evilrabbit_/status/2058241934850998426",
    followers: 45220,
    verified: true,
  },
  {
    name: "OrcDev",
    handle: "orcdev",
    avatar: "/avatars/orcdev.jpg",
    quote:
      ".@radiumcoders is the creator of Evil Buttons, and he's only 16\n\nsuper talented builder, I think he's going to become an amazing design engineer.\n\neven @davidhdev, the creator of React Bits, already contributed one button 🔥\n\nI'll add one soon too :)\n\ncalling everyone to contribute at least ONE button ⚔️",
    href: "https://x.com/orcdev/status/2058236938989998422",
    followers: 9158,
    verified: true,
  },
  {
    name: "Swami",
    handle: "SwamiMalode",
    avatar: "/avatars/swamimalode.jpg",
    quote:
      "Haha yes,\n\nRooting for @radiumcoders , I think he's gonna do great work",
    href: "https://x.com/SwamiMalode/status/2058229867142115620",
    followers: 1532,
    verified: true,
  },
  {
    name: "Ajay Patel",
    handle: "ajaypatel_aj",
    avatar: "/avatars/ajaypatel_aj.jpg",
    quote:
      "Just realized, we crossed 1700 stars for @ShadcnStudio :)\n\nGreat project, Jay!\nBookmarked ✅",
    href: "https://x.com/ajaypatel_aj/status/2077016745957810589",
    followers: 1557,
    verified: true,
  },
  {
    name: "KapishDima",
    handle: "kapish_dima",
    avatar: "/avatars/kapish_dima.jpg",
    quote:
      "Jay is a great developer with a lot of potential!\nHe reminds me of myself at his age :DDD",
    href: "https://x.com/kapish_dima/status/2075198626381418769",
    followers: 2092,
    verified: true,
  },
  {
    name: "Chánh Đại",
    handle: "iamncdai",
    avatar: "/avatars/iamncdai.jpg",
    quote: "Thanks Jay. Super cool.",
    href: "https://x.com/iamncdai/status/2074852650219409912",
    followers: 3560,
    verified: true,
  },
  {
    name: "François Best",
    handle: "fortysevenfx",
    avatar: "/avatars/fortysevenfx.jpg",
    quote: "Looks cool!",
    href: "https://x.com/fortysevenfx/status/2074849603959095630",
    followers: 3253,
    verified: true,
  },
  {
    name: "Remocn",
    handle: "_remocn",
    avatar: "/remocn.png",
    quote:
      "Remocn no longer has the ability to generate videos\n(I didn't want to add authorization and other infrastructure)\nThanks @radiumcoders for making this tool. This is now the only working way to create GitHub Stars Videos",
    href: "https://x.com/_remocn/status/2076975094690132231",
    followers: 1340,
    verified: true,
  },
]

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: () => number) {
  const next = [...items]

  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }

  return next
}

function mustFind(items: Testimonial[], href: string) {
  const found = items.find((item) => item.href === href)

  if (!found) {
    throw new Error(`Missing testimonial: ${href}`)
  }

  return found
}

function spreadAuthors(items: Testimonial[]) {
  const result: Testimonial[] = []
  const pool = [...items]

  while (pool.length) {
    const lastHandle = result.at(-1)?.handle
    const index = pool.findIndex((item) => item.handle !== lastHandle)
    result.push(pool.splice(index === -1 ? 0 : index, 1)[0])
  }

  return result
}

export const featuredTestimonials = [
  mustFind(testimonials, "https://x.com/orcdev/status/2058236938989998422"),
  mustFind(testimonials, "https://x.com/evilrabbit_/status/2058241934850998426"),
  mustFind(testimonials, "https://x.com/iamncdai/status/2074852650219409912"),
  mustFind(testimonials, "https://x.com/0xMassi/status/2084637478447730777"),
  mustFind(testimonials, "https://x.com/kapish_dima/status/2075198626381418769"),
]

const featuredHrefs = new Set(featuredTestimonials.map((item) => item.href))

export const trailingTestimonials = [
  mustFind(testimonials, "https://x.com/_remocn/status/2076975094690132231"),
]

const trailingHrefs = new Set(trailingTestimonials.map((item) => item.href))

export const restTestimonials = spreadAuthors(
  shuffle(
    testimonials.filter(
      (item) => !featuredHrefs.has(item.href) && !trailingHrefs.has(item.href)
    ),
    mulberry32(23)
  )
)
