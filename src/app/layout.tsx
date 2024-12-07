import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/utils/Sidebar"
import { Providers } from "./providers"
import PlanTripProvider from "@/components/utils/ContextProvider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        <PlanTripProvider>
          <Providers />
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />

            {children}
            <Analytics />
          </SidebarProvider>
        </PlanTripProvider>
      </body>
    </html>
  )
}
