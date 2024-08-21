import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";

import type { Viewport } from "next";
import Script from "next/script";
import Footer from "./components/footer";

export const viewport: Viewport = {
  themeColor: "#ff9c4",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tftourneys.com/"),
  title: {
    default: "TFTourneys",
    template: "TFTourneys | %s",
  },
  description:
    "TFTourneys is dedicated to all things related to TFT Esports! Keep up with LIVE and upcoming tournaments or explore the results of past tournaments.",
  openGraph: {
    title: "TFTourneys",
    description:
      "TFTourneys is dedicated to all things related to TFT Esports! Keep up with LIVE and upcoming tournaments or explore the results of past tournaments.",
    siteName: "TFTourneys",
    images: "/opengraph-image.png",
    type: "website",
  },
  keywords: ["Tournaments", "TFTourneys", "Esports"],
  twitter: {
    card: "summary_large_image",
    title: "TFTourneys",
    description: "All things TFT Esports",
    images: "/opengraph-image.png", // Must be an absolute URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://tftourneys.com/" />

        <link rel="preconnect" href="https://use.typekit.net/cdd6oyg.css" />
        <link rel="dns-prefetch" href="https://use.typekit.net/cdd6oyg.css" />
        <link rel="stylesheet" href="https://use.typekit.net/cdd6oyg.css" />

        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body className="">
        <div className="font-soleil overflow-x-clip">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
