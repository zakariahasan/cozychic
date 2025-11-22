import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/mobileMenu/mobileMenu";

export const metadata: Metadata = {
  title: "Cozy Chic",
  description: "CHARGRILLED CHICKEN & KEBAB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <MobileMenu />
        <Header />
        <main className="flex-1 w-full max-w-[1400px] mx-auto w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
