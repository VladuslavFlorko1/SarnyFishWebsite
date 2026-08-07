import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sarnyfish.com"),
  title: "SarnyFish — риболовні локації Сарненського району",
  description:
    "Знаходь найкращі місця для риболовлі в Сарненському районі, ділись уловами, читай відгуки та спілкуйся з іншими рибалками. Інтерактивна карта водойм, лайки, коментарі та спільнота однодумців.",
  keywords: [
    "риболовля Сарни",
    "риболовля Рівненська область",
    "місця для риболовлі",
    "карта водойм",
    "рибальські локації",
    "SarnyFish",
    "рибалка Україна",
  ],
  authors: [{ name: "SarnyFish" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "SarnyFish — риболовні локації Сарненського району",
    description:
      "Знаходь найкращі місця для риболовлі, ділись уловами та спілкуйся з рибалками-однодумцями.",
    url: "https://www.sarnyfish.com",
    siteName: "SarnyFish",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SarnyFish — платформа для рибалок",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SarnyFish — риболовні локації Сарненського району",
    description:
      "Знаходь найкращі місця для риболовлі, ділись уловами та спілкуйся з рибалками-однодумцями.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgba(10, 74, 95, 0.95)",
                color: "#e8f7de",
                border: "1px solid rgba(23, 179, 217, 0.3)",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                backdropFilter: "blur(12px)",
              },
              success: {
                iconTheme: {
                  primary: "#a8e063",
                  secondary: "#0f2e3d",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ff8a8a",
                  secondary: "#0f2e3d",
                },
              },
            }}
          />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
