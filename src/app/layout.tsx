import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ShopProvider } from '../context/ShopContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/ui/ToastContainer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopMate AI - Premium AI-Powered E-Commerce Shopping Assistant',
  description:
    'Experience intelligent tech shopping with ShopMate AI. Unbiased product analysis, side-by-side spec comparison, and interactive AI shopping assistance in INR.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-[#f4f5f8] antialiased">
        <ShopProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
        </ShopProvider>
      </body>
    </html>
  );
}
