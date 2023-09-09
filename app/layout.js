"use client"

import { Inter } from 'next/font/google'
import Topbar from '@/components/topbar';
import Footer from '@/components/footer';
import { SessionProvider } from "next-auth/react"
import { Analytics } from '@vercel/analytics/react';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Storyline Showdowns</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Topbar />
          <div style={{ minHeight: '80vh' }}>
            {children}
          </div>
          <Footer />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
