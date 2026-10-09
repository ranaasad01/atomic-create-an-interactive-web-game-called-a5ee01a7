import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "Syntax Sheriff — Cyber-Western Coding Duels",
  description:
    "Draw your fix before the clock runs dry. Syntax Sheriff is an interactive cyber-western arcade that trains beginner coders to spot and fix real Python and JavaScript bugs under pressure.",
  openGraph: {
    title: "Syntax Sheriff — Cyber-Western Coding Duels",
    description:
      "Fix buggy code snippets against the clock, advance your robot deputy across the desert, and climb the High Noon Badlands Registry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#19120d] font-sans text-[#f0dfd7] antialiased">
        <LocaleProvider>
          <Navbar />
          {children}
          <Footer />
          <LanguageToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}