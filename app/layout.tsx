import type { Metadata } from "next";
import { Geist, Geist_Mono, Oxanium, Merriweather, Fira_Code } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});


export const metadata: Metadata = {
  title: "Movie recommendations made easy",
  description: "AI powered movie recommendations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${oxanium.variable} ${firaCode.variable} ${merriweather.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
