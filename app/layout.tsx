import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ShaderBackground } from "@/components/shader-background"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Jay - Radiumcoders",
  description: "I build, break, ship stuff. AI native design engineering.",
  openGraph: {
    title: "Jay - Radiumcoders",
    description: "I build, break, ship stuff. AI native design engineering.",
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
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <ShaderBackground />
          <div className="relative z-10">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
