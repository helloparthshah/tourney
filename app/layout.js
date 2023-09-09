"use client"

import { Inter } from 'next/font/google'
import Topbar from '@/components/topbar';
import Footer from '@/components/footer';
import { SessionProvider } from "next-auth/react"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        <div style={{ minHeight: '80vh' }}>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </div>
        <Footer />
      </body>
    </html>
  )
}
