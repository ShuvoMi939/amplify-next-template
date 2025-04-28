// app/layout.tsx

import Header from './components/Header';
import Footer from './components/Footer';
import { Inter } from "next/font/google";
import './globals.css'; // Import global CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MySite",
  description: "A sample Next.js site with reloadless page navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
