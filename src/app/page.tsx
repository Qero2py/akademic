"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, TrendingUp, Users, GraduationCap, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Definisi Interface TypeScript untuk kecocokan tipe data API
interface ChartData {
  name: string;
  ipk: number;
}

interface Student {
  nim: string;
  nama: string;
  kelas: string;
  ipk: number;
  status: string;
}

interface AnalyticsData {
  total_mahasiswa: number;
  total_berisiko: number;
  persentase_lulus_tepat_waktu: string;
  chart_data: ChartData[];
  monitor_students: Student[];
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/dashboard-analytics`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const result = await response.json();
        
        // PENCEGAHAN CRASH: Jika backend mengirim JSON berisi "error" (misal karena database kosong)
        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan koneksi");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Tampilan Loading Spinner bergaya minimalis saat fetch data berlangsung
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi text-sumi">
        <Loader2 className="w-8 h-8 animate-spin text-ai mb-2" />
        <p className="text-sm font-medium tracking-wide">Memuat Analisis Machine Learning...</p>
      </div>
    );
  }

  // Tampilan Error yang Lebih Cerdas (Bisa membedakan server mati vs database kosong)
  if (error || !data) {
    const isDatabaseEmpty = error === "Database kosong";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi p-4 text-center">
        <div className="p-4 bg-aka/10 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-aka" />
        </div>
        <h2 className="text-xl font-bold text-sumi">
          {isDatabaseEmpty ? "Database Supabase Kosong" : "Koneksi Backend Terputus"}
        </h2>
        <p className="text-sm text-sumi/70 mt-2 max-w-md">
          {isDatabaseEmpty 
            ? "Sistem berjalan normal, namun tidak ada data mahasiswa untuk dianalisis. Silakan jalankan 'python3 seed_db.py' di terminal backend untuk memasukkan 50 data awal."
            : "Pastikan server FastAPI Anda di Hugging Face sudah berjalan dan URL Environment Variable sudah benar."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-4 py-2 bg-ai text-white rounded-xl text-sm font-medium hover:bg-ai/90 transition-colors"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-washi text-sumi">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview Akademik</h1>
            <p className="text-sumi/70 mt-1">Sistem Prediksi Performa Mahasiswa Berbasis ML</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-matcha animate-pulse"></span>
            <span className="text-xs font-semibold text-sumi/80 tracking-wider uppercase">Live Backend Connected</span>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Metrik 1: Total Mahasiswa */}
          <div className="md:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sumi/70 font-medium">Total Dataset Evaluasi</span>
              <div className="p-2 bg-washi rounded-full">
                <Users className="w-5 h-5 text-ai" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-4xl font-bold">{data.total_mahasiswa.toLocaleString()}</h2>
              <p className="text-sm text-matcha mt-2 flex items-center font-medium">
                <TrendingUp className="w-4 h-4 mr-1" /> Data real-time terenkripsi
              </p>
            </div>
          </div>

          {/* Metrik 2: Prediksi Lulus Tepat Waktu (Random Forest) */}
          <div className="md:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sumi/70 font-medium">Prediksi Lulus Tepat Waktu</span>
              <div className="p-2 bg-washi rounded-full">
                <GraduationCap className="w-5 h-5 text-matcha" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-4xl font-bold">{data.persentase_lulus_tepat_waktu}</h2>
              <p className="text-sm text-sumi/60 mt-2">Akurasi dioptimasi via Random Forest</p>
            </div>
          </div>

          {/* Alert Box: Klasifikasi Berisiko (Decision Tree) */}
          <div className="md:col-span-4 bg-[#FDF5F5] p-6 rounded-3xl shadow-sm border border-[#FAD4D4] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-aka font-semibold">Perhatian Khusus</span>
              <div className="p-2 bg-aka/10 rounded-full">
                <AlertTriangle className="w-5 h-5 text-aka" />
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <h2 className="text-4xl font-bold text-aka">{data.total_berisiko}</h2>
              <p className="text-sm text-aka/80 mt-2 font-medium">Terklasifikasi berisiko tinggi oleh Decision Tree</p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-aka/5 rounded-full blur-2xl"></div>
          </div>

          {/* Main Chart: Proyeksi Linear Regression */}
          <div className="md:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[350px] flex flex-col">
            <div className="mb-4">
              <h3 className="font-bold text-lg">Tren Proyeksi IPK Angkatan</h3>
              <p className="text-sm text-sumi/60">Estimasi tren nilai rerata menggunakan Linear Regression</p>
            </div>

            <div className="flex-1 w-full h-[250px] mt-2">
              <ResponsiveContainer width="99%" height="99%">
                <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIpk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F3160" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1F3160" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" vertical={false} />
                  <XAxis dataKey="name" stroke="#A3A3A3" fontSize={11} tickLine={false} />
                  <YAxis domain={[2.5, 4.0]} stroke="#A3A3A3" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#F7F4EB", border: "1px solid #E5E7EB", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    labelStyle={{ fontWeight: "bold", color: "#2C2C2C" }}
                  />
                  <Area type="monotone" dataKey="ipk" stroke="#1F3160" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIpk)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student List Monitor */}
          <div className="md:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Monitor Mahasiswa</h3>
              <Link 
                href="/students" 
                className="text-ai hover:text-ai/70 transition-colors p-1.5 bg-washi rounded-full flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[260px] pr-1">
              {data.monitor_students.map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-washi/30 border border-gray-50 hover:bg-washi/60 hover:border-gray-100 transition-all duration-200">
                  <div>
                    <Link href={`/students/${student.nim}`} className="hover:underline text-ai">
                      {student.nama}
                    </Link>
                    <p className="text-xs text-sumi/50 mt-0.5">{student.kelas} • NIM {student.nim}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-sumi/80">IPK {student.ipk}</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${student.status === "Aman" ? "bg-matcha/10 text-matcha" : "bg-aka/10 text-aka"
                      }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}