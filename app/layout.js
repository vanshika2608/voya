import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' });

export const metadata = {
  title: 'Voya — Your AI travel companion',
  description: 'Plan extraordinary trips with an AI that thinks like a seasoned traveler.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-center" toastOptions={{ style: { background: 'white', border: '1px solid #eee' } }} />
      </body>
    </html>
  );
}
