import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trinitaria RP - Official Shop',
  description: 'Shop for in-game items and services on the Trinitaria RP Server',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
