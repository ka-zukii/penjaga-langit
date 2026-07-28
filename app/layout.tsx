import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Penjaga Langit - Game Arcade Tembak Pesawat 2D",
  description:
    "Mainkan Penjaga Langit, game arcade aksi tembak-tembakan pesawat 2D seru! Lindungi angkasa dari musuh, raih skor tertinggi, dan nikmati petualangan udara yang menegangkan.",
  keywords: [
    "Penjaga Langit",
    "Game Pesawat 2D",
    "Game Tembak Pesawat",
    "Air Combat Game",
    "Arcade Shooter",
    "Game Web Indonesia",
    "2D Space Shooter",
  ],
  authors: [{ name: "Penjaga Langit Team" }],
  openGraph: {
    title: "Penjaga Langit - Game Arcade Tembak Pesawat 2D",
    description:
      "Uji ketangkasanmu menjaga angkasa! Mainkan game tembak-tembakan pesawat 2D Penjaga Langit secara gratis di browser.",
    url: "https://penjaga-langit.vercel.app",
    siteName: "Penjaga Langit",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Banner Game Penjaga Langit",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penjaga Langit - Game Arcade Tembak Pesawat 2D",
    description:
      "Lindungi angkasa dari serangan musuh! Mainkan game aksi tembak pesawat 2D Penjaga Langit sekarang.",
    images: ["/banner.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
