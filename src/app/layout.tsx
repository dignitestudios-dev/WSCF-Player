import type { Metadata } from "next";
import { rootMetadata } from "@/config/site-metadata";
import Providers from "@/providers";
import OfflineGuard from "@/components/offline-guard";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <OfflineGuard>{children}</OfflineGuard>
        </Providers>
      </body>
    </html>
  );
}
