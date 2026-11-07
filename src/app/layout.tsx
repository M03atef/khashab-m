import type { Metadata, Viewport } from "next";
import "@fontsource/alexandria/arabic-300.css";
import "@fontsource/alexandria/arabic-400.css";
import "@fontsource/alexandria/arabic-600.css";
import "@fontsource/alexandria/arabic-800.css";
import "@fontsource/alexandria/latin-400.css";
import "@fontsource/alexandria/latin-600.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL } from "@/lib/site";

export const viewport: Viewport = {
  themeColor: "#3a2516",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "خشبة | معرض الأثاث الخشبي الفاخر",
  description:
    "خشبة - براند متخصص في تصنيع الأثاث الخشبي الفاخر: مكتبات، كونسولات، مكاتب، أبواب، رفوف معلقة، ترابيزات مودرن، فواصل، وحدات تلفزيون، وتكسية جدران. نصنع لك قطعة فريدة تدوم.",
  keywords: [
    "خشبة",
    "أثاث خشبي",
    "مكتبات",
    "كونسولات",
    "مكاتب",
    "أبواب",
    "رفوف معلقة",
    "ترابيزات مودرن",
    "فواصل",
    "وحدات تلفزيون",
    "تكسية جدران",
    "أثاث مصر",
  ],
  authors: [{ name: "خشبة" }],
  icons: {
    icon: [{ url: "/brand/icon.svg", type: "image/svg+xml" }, { url: "/brand/icon-192.png", sizes: "192x192" }],
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "خشبة | معرض الأثاث الخشبي الفاخر",
    description:
      "نصنع لك الأثاث الخشبي الفاخر بتصميمات مودرن وإتقان يدوي. تصفح معرضنا واختر قطعتك المميزة.",
    siteName: "خشبة",
    type: "website",
    locale: "ar_EG",
    images: [
      {
        url: "/brand/og.jpg",
        width: 1200,
        height: 630,
        alt: "خشبة — أثاث خشبي فاخر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "خشبة | معرض الأثاث الخشبي الفاخر",
    description: "أثاث خشبي فاخر بتصميمات مودرن وإتقان يدوي.",
    images: ["/brand/og.jpg"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "خشبة",
  alternateName: "Khashaba",
  description:
    "براند متخصص في تصنيع الأثاث الخشبي الفاخر في مصر: مكتبات، كونسولات، مكاتب، أبواب، رفوف، وحدات تلفزيون وتكسية جدران.",
  url: SITE_URL,
  telephone: "+201070386575",
  email: "info@khashaba.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "القاهرة",
    addressCountry: "EG",
  },
  image: `${SITE_URL}/brand/og.jpg`,
  logo: `${SITE_URL}/brand/icon-512.png`,
  openingHours: "Sa-Th 10:00-21:00",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61594437931625",
    "https://www.instagram.com/khashaba.wood/?hl=en",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body
        className="antialiased bg-background text-foreground font-sans"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
