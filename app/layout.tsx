import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OnboardingProvider from '@/components/providers/OnboardingProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Panda Mart Kenya - Your World of Amazing Deals',
  description: 'Discover amazing deals on electronics, fashion, home goods and more at Panda Mart Kenya. Shop online or visit our stores across Kenya.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pandamart.co.ke'),
  icons: {
    icon: '/panda.ico',
    shortcut: '/panda.ico',
    apple: '/panda.ico',
  },
  openGraph: {
    title: 'Panda Mart Kenya - Your World of Amazing Deals',
    description: 'Discover amazing deals on electronics, fashion, home goods and more at Panda Mart Kenya.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://pandamart.co.ke',
    siteName: 'Panda Mart Kenya',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Panda Mart Kenya',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda Mart Kenya - Your World of Amazing Deals',
    description: 'Discover amazing deals on electronics, fashion, home goods and more at Panda Mart Kenya.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/panda.ico" sizes="any" />
        <link rel="icon" href="/panda.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/panda.ico" />
      </head>
      <body className={inter.className}>
        <div id="root" className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <OnboardingProvider />
        </div>
      </body>
    </html>
  )
}