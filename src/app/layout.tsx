import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3, Caveat, Playfair_Display, Nunito, DM_Serif_Display, Lora } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ArtByMe — Mixed Media & Fine Art by Margaret Edmondson",
    template: "%s | ArtByMe",
  },
  description:
    "Original mixed-media collage art, oil paintings, fine art prints, and art classes by Margaret Edmondson. Commission custom artwork or shop the gallery.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://artbyme.studio"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ArtByMe",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${sourceSans.variable} ${caveat.variable} ${playfair.variable} ${nunito.variable} ${dmSerif.variable} ${lora.variable}`}
    >
      <body className="min-h-screen bg-cream text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
