import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoZombies - 以太坊僵尸游戏",
  description: "在以太坊上创建、收集和战斗你的僵尸军团。体验区块链游戏的魅力，收集独特的僵尸NFT，参与激烈的战斗！",
  keywords: ["CryptoZombies", "以太坊", "区块链游戏", "NFT", "僵尸", "游戏"],
  authors: [{ name: "CryptoZombies Team" }],
  creator: "CryptoZombies",
  publisher: "CryptoZombies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cryptozombies-game.vercel.app'),
  openGraph: {
    title: "CryptoZombies - 以太坊僵尸游戏",
    description: "在以太坊上创建、收集和战斗你的僵尸军团",
    url: "https://cryptozombies-game.vercel.app",
    siteName: "CryptoZombies",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CryptoZombies Game",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoZombies - 以太坊僵尸游戏",
    description: "在以太坊上创建、收集和战斗你的僵尸军团",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="antialiased">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
