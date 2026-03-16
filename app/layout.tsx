import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoNastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-urdu", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "PCC Query Management Portal",
  description: "Punjab Charity Commission Public Queries Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoNastaliq.variable} font-sans bg-zinc-50 text-zinc-900 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
