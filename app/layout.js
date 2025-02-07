import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Streamio",
  description: "A video streaming serivce",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="mytheme" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-secondary antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
