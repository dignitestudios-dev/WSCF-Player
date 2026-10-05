import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_SHORT_NAME } from "@/config/site-metadata";

/**
 * What makes "Add to Home Screen" open the app as an app: its own window, no
 * browser address bar, the WSCF colour in the status bar.
 *
 * Installability only — there is deliberately no service worker, so the app
 * still needs a connection exactly as it does in the browser.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description:
      "Register for scholastic chess tournaments, look up ratings and manage your players.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F6FF",
    theme_color: "#083F92",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
