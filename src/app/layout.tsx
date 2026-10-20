import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:43127"
  ),
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
    icon: "/khashaba-logo.png",
    apple: "/khashaba-logo.png",
  },
  openGraph: {
    title: "خشبة | معرض الأثاث الخشبي الفاخر",
    description:
      "نصنع لك الأثاث الخشبي الفاخر بتصميمات مودرن وإتقان يدوي. تصفح معرضنا واختر قطعتك المميزة.",
    siteName: "خشبة",
    type: "website",
    locale: "ar_EG",
    images: [
      {
        url: "/hero-bg.jpg",
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
    images: ["/hero-bg.jpg"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "خشبة",
  alternateName: "Khashaba",
  description:
    "براند متخصص في تصنيع الأثاث الخشبي الفاخر في مصر: مكتبات، كونسولات، مكاتب، أبواب، رفوف، وحدات تلفزيون وتكسية جدران.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:43127",
  telephone: "+201070386575",
  email: "info@khashaba.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "القاهرة",
    addressCountry: "EG",
  },
  image: "/khashaba-logo.png",
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
        {/* Keep Next.js DevTools "N" from covering the WhatsApp FAB */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              "nextjs-portal{display:none!important;visibility:hidden!important;pointer-events:none!important}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${tajawal.variable} antialiased bg-background text-foreground font-cairo`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
