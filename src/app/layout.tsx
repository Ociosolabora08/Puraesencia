import type { Metadata, Viewport } from "next";
import { Quicksand, Dancing_Script, Caveat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: "Pura Esencia | Cosmética Natural Hecha a Mano",
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
  openGraph: {
    title: "Pura Esencia | Cosmética Natural Hecha a Mano",
    description:
      "Productos artesanales con ingredientes honestos, hechos a mano con cariño — para cuidarte sin sacrificar la belleza, ni el planeta.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
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
        <Toaster />
      </body>
    </html>
  );
}
