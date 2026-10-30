import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { GeistSerif } from "geist/font/serif/variable"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { Frame, Rule } from "@/components/frame"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-serif",
        GeistSerif.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Frame>
            <Navbar />
            <Rule />
            {children}
            <Footer />
          </Frame>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
