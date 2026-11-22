import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// Absolute base for link previews (share cards). Set NEXT_PUBLIC_SITE_URL once there's a domain; Vercel previews use their own URL.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Shape: become a complete product designer", template: "%s · Shape" },
  description: "Map your design skills, see the designer you can become, and follow a path built for you.",
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-primary antialiased">
        <RouteProvider>
          <Theme>{children}</Theme>
        </RouteProvider>
      </body>
    </html>
  );
}
