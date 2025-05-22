import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import "./nprogress.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingProvider from "@/components/LoadingProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import SessionProvider from "@/components/SessionProvider";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/700.css";

// Keep Geist Mono for code blocks
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "二次元博客 | Anime Blog",
  description: "探索动漫、游戏、编程和二次元文化的世界",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <ThemeProvider>
          <body
            className={`${robotoMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-quicksand`}
          >
            <LoadingProvider />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}
