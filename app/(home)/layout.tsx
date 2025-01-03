import type { Metadata } from "next";
import "./globals.css";
import { SideMenu } from '@/components/side-menu';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Web Reader Core",
  description: "Web Reader Core",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen">
          <SideMenu />
          <main className="flex-1 overflow-auto transition-all duration-300">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
