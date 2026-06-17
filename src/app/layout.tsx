import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Academic Prediction System",
  description: "Sistem Prediksi Performa Mahasiswa berbasis Machine Learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-washi text-sumi antialiased`}>
        {/* Flex kontainer utama: Sidebar di kiri, Konten Halaman di kanan */}
        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}