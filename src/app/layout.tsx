import type { Metadata, Viewport } from "next";
import { Sunflower } from "next/font/google";
import "./globals.css";

const sunflower = Sunflower({
  variable: "--font-sunflower",
  subsets: ["latin"],
  weight: ["300", "500", "700"]
});

export const metadata: Metadata = {
  title: "단시 공방",
  description: "시와 감성을 나누는 창작 공간",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "단시 공방",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    type: "website",
    siteName: "단시 공방",
    title: "단시 공방",
    description: "시와 감성을 나누는 창작 공간",
    images: '/icons/icon-192x192.png',
  },
  twitter: {
    card: "summary",
    title: "단시 공방",
    description: "시와 감성을 나누는 창작 공간",
    images: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#735030",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${sunflower.variable} antialiased font-sans`}
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
