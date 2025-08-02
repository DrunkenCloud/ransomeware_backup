import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neural Network Demo Lab',
  description: 'Interactive lab for understanding neural networks'
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
