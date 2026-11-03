import type { Metadata } from "next"
import { GeistSerif } from "geist/font/serif/variable"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL("https://radiumcoders.com"),
  title: "Jay - Radiumcoders",
  description:
    "Design engineer building UI libraries, native apps, and open-source tools.",
  openGraph: {
    title: "Jay - Radiumcoders",
    description:
      "Design engineer building UI libraries, native apps, and open-source tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@radiumcoders",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-serif", GeistSerif.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
