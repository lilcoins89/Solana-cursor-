import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'SignalOS — Solana market intelligence',
  description: 'A real-time intelligence workspace for discovering, auditing, and forecasting Solana tokens.',
  openGraph: {
    title: 'SignalOS — Solana market intelligence',
    description: 'Discover stronger signals before the market catches up.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignalOS — Solana market intelligence',
    description: 'Discover stronger signals before the market catches up.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
