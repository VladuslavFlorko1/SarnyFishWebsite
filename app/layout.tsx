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
  title: "SarnyFish",
  description:
    "SarnyFish is a platform for anglers to discover fishing locations, share catches, and explore the best fishing spots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
