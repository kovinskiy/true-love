import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Приглашение на свадьбу Саши и Кати',
  description: 'Свадебное приглашение в стиле Love is',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
