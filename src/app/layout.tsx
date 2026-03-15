import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getFactoryConfig } from "@/lib/factory";
import { resolveTheme } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = getFactoryConfig();

export const metadata: Metadata = {
  title: config.product.name,
  description: config.product.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mode, vars } = resolveTheme();
  const cssVarBlock = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");

  return (
    <html lang="en" data-theme={mode}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{${cssVarBlock}}` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
