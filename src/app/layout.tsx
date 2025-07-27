import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KashMirage',
  description: 'Scan. Discover. Learn.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The body is now styled by globals.css.
        The layout is a clean shell, and the page itself will handle
        rendering its own Header, Footer, and background overlay.
      */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
