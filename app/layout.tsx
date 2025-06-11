import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '概念魔方',
  description: '转动思维的魔方，看见概念的形状',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700;900" 
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      </head>
      <body style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", "Noto Sans SC", sans-serif'}}>{children}</body>
    </html>
  )
}
