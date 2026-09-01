import type { Metadata, Viewport } from "next";
import { Quicksand, Dancing_Script, Caveat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/brand/footer";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pura Esencia | Cosmética Natural Hecha a Mano",
    template: "%s | Pura Esencia",
  },
  description:
    "Productos artesanales con ingredientes honestos, hechos a mano con cariño. Jabones, velas, cremas y aceites naturales en pequeños lotes.",
  keywords: [
    "cosmética natural",
    "productos artesanales",
    "hecho a mano",
    "jabones naturales",
    "velas aromáticas",
    "skincare natural",
    "Pura Esencia",
  ],
  authors: [{ name: "Pura Esencia" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pura Esencia | Cosmética Natural Hecha a Mano",
    description:
      "Productos artesanales con ingredientes honestos, hechos a mano con cariño — para cuidarte sin sacrificar la belleza, ni el planeta.",
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Pura Esencia",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pura Esencia — Cosmética natural hecha a mano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pura Esencia | Cosmética Natural Hecha a Mano",
    description:
      "Jabones, velas, cremas y aceites naturales en pequeños lotes hechos a mano.",
    images: ["/og-default.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  // Sin maximumScale/userScalable: el zoom es derecho de quien lo necesita (WCAG 1.4.4)
  themeColor: "#FF5A8F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${quicksand.variable} ${dancingScript.variable} ${caveat.variable} ${cormorant.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
