import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phishing Detection Lab',
  description: 'Interactive lab for learning phishing detection techniques'
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
