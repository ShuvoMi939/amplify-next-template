// app/layout.tsx

import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports"; // Correct import
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure Amplify once
Amplify.configure(awsExports);

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nirdeshona",
  description: "Your Trusted Partner",
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
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
