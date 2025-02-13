import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import RouteChangeHandler from "@/components/RouteChangeHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Streamio",
  description: "A video streaming service",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="mytheme" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-secondary antialiased`}
      >
        <Providers>
          <RouteChangeHandler />
          {children}
        </Providers>
      </body>
    </html>
  );
}
