"use client"

import { Inter } from 'next/font/google'
import Topbar from '@/components/topbar';
import Footer from '@/components/footer';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        <div style={{ minHeight: '80vh' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
