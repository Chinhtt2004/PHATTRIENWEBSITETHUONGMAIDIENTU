import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster"
=======
import { Toaster } from "@/components/ui/sonner"
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin", "vietnamese"],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'GlowSkin | Mỹ Phẩm Chính Hãng - Trang Web Thương Mại Điện Tử Mỹ Phẩm',
  description: 'Khám phá bộ sưu tập mỹ phẩm cao cấp tại GlowSkin. Sản phẩm chính hãng, giá tốt nhất, giao hàng toàn quốc. Chăm sóc da, trang điểm, dưỡng thể và nhiều hơn nữa.',
  keywords: ['mỹ phẩm', 'chăm sóc da', 'serum', 'kem dưỡng', 'son môi', 'mỹ phẩm chính hãng'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'GlowSkin',
  },
}

export const viewport: Viewport = {
  themeColor: '#B76E79',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<<<<<<< HEAD
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
=======
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
>>>>>>> 65e567118427e2f39d6608b6d8e486d7a03f2a73
        {children}
        <Toaster />
        <ChatbotWidget />
        <Analytics />
      </body>
    </html>
  )
}
