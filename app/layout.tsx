import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'HSD GmbH - Handel • Service • Dienstleistung',
  description: 'Professionelle Felgenaufbereitung, Reifenservice und Handel in höchster Qualität',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased bg-gray-900">{children}</body>
    </html>
  );
}