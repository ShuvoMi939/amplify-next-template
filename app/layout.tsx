// app/layout.tsx

import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports"; // Correct import
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter, Anek_Bangla } from "next/font/google";
import "./globals.css";


// Configure Amplify once
Amplify.configure(awsExports);

// Add Anek Bangla font
const inter = Inter({ subsets: ["latin"] });
const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"], // choose necessary weights
  display: "swap",
  variable: "--font-anek-bangla", // optional for CSS usage
});

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
    <html lang="en" className={anekBangla.className}>
      <body className={`${inter.className} ${anekBangla.className}`}>
        <Header />
        <main className="min-h-fit">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
