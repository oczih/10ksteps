import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from './provider';
import GeminiChat from '@/components/GeminiChat';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '10k Steps',
  description: 'Track your daily walks, set goals, and explore new routes. Make every step count!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#1c232b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '10k Steps',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1c232b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="10k Steps" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Provider>
          {children}
          <GeminiChat />
        </Provider>
      </body>
    </html>
  );
}
