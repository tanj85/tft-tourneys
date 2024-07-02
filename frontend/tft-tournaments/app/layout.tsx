import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";

import type { Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#ff9c4",
};

// export const metadata: Metadata = {
//   title: "TFTourneys",
//   description:
//     "TFTourneys is dedicated to all things related to TFT Esports! Keep up with LIVE and upcoming tournaments or explore the results of past tournaments. Follow your favorite players and see how their performances line up against their competitors.",
// };

export const metadata: Metadata = {
  metadataBase: new URL("https://tftourneys.com/"),
  title: {
    default: "TFTourneys",
    template: "%s | TFTourneys",
  },
  description:
    "TFTourneys is dedicated to all things related to TFT Esports! Keep up with LIVE and upcoming tournaments or explore the results of past tournaments. Follow your favorite players and see how their performances line up against their competitors.",
  openGraph: {
    title: "TFTourneys",
    description:
      "TFTourneys is dedicated to all things related to TFT Esports! Keep up with LIVE and upcoming tournaments or explore the results of past tournaments. Follow your favorite players and see how their performances line up against their competitors.",
    siteName: "TFTourneys",
    images: "/opengraph-image.png",
    type: "website",
  },
  keywords: ["TFT", "TFTourneys", "Esports"],
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
        <link rel="stylesheet" href="https://use.typekit.net/cdd6oyg.css" />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
        {/* <title>TFTourneys</title>
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
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /> */}

        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="TFTourneys" />
        <meta name="twitter:title" content="TFTourneys" />
        <meta
          name="twitter:description"
          content="TFTourneys is dedicated to all things related to TFT Esports! Keep up with LIVE and upcoming tournaments or explore the results of past tournaments. Follow your favorite players and see how their performances line up against their competitors."
        />
        <meta name="twitter:image" content="/tft-banner.png" /> */}
      </head>
      <body className="">
        <div className="font-soleil">
          <Navbar />
          {children}
        </div>
        {/* <Script src="https://unpkg.com/aos@next/dist/aos.js" />
        <Script>AOS.init();</Script> */}
      </body>
    </html>
  );
}
