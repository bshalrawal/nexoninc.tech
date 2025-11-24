import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { WhatsAppCTA } from '@/components/ui/whatsapp-cta';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { EmailCTA } from '@/components/ui/email-cta';

export const metadata: Metadata = {
  title: 'Nexon Inc- Engineering Success',
  description: 'Nexon Inc is a leading creative agency in Kathmandu with expertise in website development, e-commerce websites, digital marketing, SEO, PPC and graphics design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
        <EmailCTA />
        <WhatsAppCTA />
        <ScrollToTop />
      </body>
    </html>
  );
}
