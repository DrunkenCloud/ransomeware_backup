import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Decision Tree Demo Lab',
  description: 'Interactive lab for understanding decision trees in machine learning'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
