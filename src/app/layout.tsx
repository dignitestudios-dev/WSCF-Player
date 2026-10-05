import type { Metadata, Viewport } from "next";
import { rootMetadata } from "@/config/site-metadata";
import Providers from "@/providers";
import OfflineGuard from "@/components/offline-guard";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

// `viewportFit: "cover"` lets the page run under the notch and the home bar so
// the bottom navigation and sheets can pad themselves with the safe-area insets
// (see globals.css). Zooming is deliberately left enabled — blocking pinch-zoom
// is an accessibility failure, and the 16px input size already stops iOS from
// zooming on focus.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#083F92",
  // When the on-screen keyboard opens, shrink the layout rather than slide the
  // page up behind it, so a form inside a sheet stays above the keyboard.
  interactiveWidget: "resizes-content",
};

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
      <body className="min-h-dvh font-sans antialiased">
        <Providers>
          <OfflineGuard>{children}</OfflineGuard>
        </Providers>
      </body>
    </html>
  );
}
