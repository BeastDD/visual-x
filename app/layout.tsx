import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: 'Visual X • TV Mode for X',
  description: 'Infinite TV-like video experience powered by X (formerly Twitter)',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],n    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}