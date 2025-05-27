"use client";

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {isAuthPage ? (
            <>{children}</>
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
              </div>
            </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
