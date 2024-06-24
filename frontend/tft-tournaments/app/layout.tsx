import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";


export const metadata: Metadata = {
  title: "TFT Tourneys",
  description: "Homepage for all TFT tournament information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Navbar />
        {children}</body>
    </html>
  );
}
