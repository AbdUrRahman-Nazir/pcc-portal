import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoNastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-urdu", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "PCC Complaint Management Portal",
  description: "Punjab Charity Commission — Submit and track your complaints online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoNastaliq.variable} font-sans bg-background text-foreground min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
