import type { Metadata } from 'next'
import './globals.css'

import { Poiret_One } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Приглашение на свадьбу Егора и Вероники',
  description: 'Свадебное приглашение',
}

export const poiretOne = Poiret_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-poiret-one',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`h-full antialiased font-pixel ${poiretOne.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
