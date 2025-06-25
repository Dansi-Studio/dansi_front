import type { Metadata } from "next";
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
      >
        {children}
      </body>
    </html>
  );
}
