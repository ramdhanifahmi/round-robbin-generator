import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swiss Badminton Doubles · Individual Leaderboard',
  description: 'Shuffle R1, then go Swiss. Per-set & rubber scoring for club nights.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
