import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import { Toaster } from 'sonner'
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BottomBar from "@/components/BottomBar";

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
          <div className="min-h-screen">
            <Navbar />
            <main className="flex">
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <div className="flex-1 md:pb-0 pb-[4.5rem]  max-h-[90.75vh] overflow-y-scroll"> {/* Add bottom padding on mobile */}
                {children}
              </div>
              <div className="md:hidden">
                <BottomBar />
              </div>
            </main>
          </div>
        </Providers>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              border: '1px solid #444',
            },
            className: 'dark',
          }}
        />
      </body>
    </html>
  )
}
