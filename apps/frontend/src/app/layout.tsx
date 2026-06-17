import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Meritus — Plataforma Digital para Avaliação de Mérito e Desempenho',
    template: '%s | Meritus',
  },
  description:
    'Sistema oficial para gerenciamento do processo de certificação e avaliação de gestores da educação municipal de Oriximiná/PA. Plataforma 100% digital, segura e em conformidade com a LGPD.',
  keywords: [
    'Meritus',
    'gestores escolares',
    'avaliação',
    'certificação',
    'educação municipal',
    'Oriximiná',
    'Pará',
    'secretaria de educação',
    'plataforma digital',
    'processo seletivo',
    'gestores educacionais',
  ],
  authors: [{ name: 'SEMED — Secretaria de Educação de Oriximiná/PA' }],
  creator: 'Prefeitura Municipal de Oriximiná',
  publisher: 'Prefeitura Municipal de Oriximiná',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'http://localhost',
    siteName: 'Meritus',
    title: 'Meritus — Plataforma Digital para Avaliação de Mérito e Desempenho',
    description:
      'Sistema oficial para gerenciamento do processo de certificação e avaliação de gestores da educação municipal de Oriximiná/PA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meritus — Plataforma Digital para Avaliação de Mérito e Desempenho',
    description:
      'Sistema oficial para gerenciamento do processo de certificação e avaliação de gestores da educação municipal de Oriximiná/PA.',
  },
  metadataBase: new URL('http://localhost'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#001b3d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#f4f6f8', color: '#333333' }}>
{children}
      </body>
    </html>
  );
}
