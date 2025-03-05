import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "leaflet/dist/leaflet.css";
import "./globals.css";
import ReduxProvider from "./reduxProvider";
import ReinstateSession from "./reinstateSession";
import NavBar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlonkStars",
  description: "Find out where you are in the world",
  icons: {
    icon: "/PlonkStarsMarker.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ReinstateSession />
          {children}
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  );
}
