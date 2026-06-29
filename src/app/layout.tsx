import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CAOS | Miguel Antonio Chávez Villalba — Full Stack Developer',
  description:
    'Portfolio de Miguel Antonio Chávez Villalba (CAOS). Desarrollador Web Full Stack con 17 años. From Chaos to Code.',
  keywords: [
    'CAOS', 'Miguel Antonio Chávez Villalba', 'Full Stack Developer',
    'Web Developer', 'React', 'Next.js', 'TypeScript', 'Portfolio',
  ],
  authors: [{ name: 'Miguel Antonio Chávez Villalba', url: 'https://github.com/caos1codex-hash' }],
  creator: 'CAOS',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'CAOS | Full Stack Developer',
    description: 'From Chaos to Code. Portfolio de Miguel Antonio Chávez Villalba.',
    url: 'https://caos1codex-hash.github.io/caos-portfolio',
    siteName: 'CAOS Portfolio',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAOS | Full Stack Developer',
    description: 'From Chaos to Code.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='es' suppressHydrationWarning className='dark'>
      <body
        className={`${inter.variable} font-sans antialiased text-foreground noise-overlay`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
