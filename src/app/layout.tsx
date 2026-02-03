import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/theme.css";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Spike Admin - Next.js",
  description: "Modernized Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css" />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased bg-surface`}>
        <SidebarProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SidebarProvider>
      </body>
    </html>
  );
}
