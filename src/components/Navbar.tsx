"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BrainCircuit, GraduationCap } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Database Mahasiswa", path: "/students", icon: Users },
    { name: "Manajemen Model ML", path: "/models", icon: BrainCircuit },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 md:h-screen md:sticky md:top-0">
      <div className="space-y-8">
        {/* Logo / Branding Sistem */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-ai text-white rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-sumi">STI PREDICTION</h2>
            <p className="text-[10px] font-mono text-sumi/40 tracking-wider">CLASS 5A SYSTEM</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Pengecekan aktif halaman (menangani sub-halaman seperti /students/[nim])
            const isActive = item.path === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-washi text-ai font-semibold shadow-sm"
                    : "text-sumi/60 hover:bg-washi/40 hover:text-sumi"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-ai" : "text-sumi/40"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Sidebar / Info Identitas Institusi */}
      <div className="pt-4 border-t border-gray-50 px-2 hidden md:block">
        <div className="text-[11px] font-bold text-sumi/70 tracking-tight">Universitas Muhammadiyah</div>
        <div className="text-[10px] font-medium text-sumi/40 mt-0.5">Prof. DR. HAMKA</div>
      </div>
    </aside>
  );
}