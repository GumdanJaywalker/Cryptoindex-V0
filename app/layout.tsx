import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<<<<<<< Updated upstream
    <html lang="en">
      <body>{children}</body>
=======
    <html lang="en" className="dark">
      <body className={inter.className}>
        <PrivyProvider>
          {children}
        </PrivyProvider>
      </body>
>>>>>>> Stashed changes
    </html>
  )
}
