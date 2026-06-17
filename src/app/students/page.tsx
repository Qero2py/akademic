"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowLeft, Loader2, AlertCircle, CheckCircle, Plus } from "lucide-react";
import Link from "next/link";

interface StudentPrediction {
  status_risiko: string;
  kelulusan: string;
  proyeksi_ipk_depan: number;
}

interface Student {
  nim: string;
  nama: string;
  kelas: string;
  ipk_saat_ini: number;
  persentase_hadir: number;
  nilai_tugas: number;
  sks_lulus: number;
  prediksi: StudentPrediction;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fungsi untuk mengambil data dari backend dengan parameter filter & search
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (statusFilter) queryParams.append("status", statusFilter);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/students?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Gagal mengambil data mahasiswa");
      
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch setiap kali filter status berubah atau saat pertama kali load
  useEffect(() => {
    fetchStudents();
  }, [statusFilter]);

  // Handle pencarian saat tombol "Enter" atau tombol search ditekan
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-washi text-sumi">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-sumi/70 hover:text-ai transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Overview
          </Link>
          <div className="text-xs text-sumi/50 font-mono">DATABASE: ACADEMIC_SYSTEM.DB</div>
        </div>

        {/* Header & Tombol Tambah Data */}
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Database Prediksi Mahasiswa</h1>
            <p className="text-sumi/70 mt-1">Daftar komprehensif hasil pemrosesan algoritma Machine Learning</p>
          </div>
          <Link 
            href="/students/add" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-ai text-white rounded-xl text-sm font-semibold hover:bg-ai/90 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Tambah Data
          </Link>
        </header>

        {/* Filter & Search Bar Panel (Bento Style) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Cari Nama atau NIM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-ai transition-colors"
            />
            <Search className="w-4 h-4 text-sumi/40 absolute left-3.5 top-3" />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-sumi/50 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-washi/50 border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium focus:outline-none focus:border-ai transition-colors text-sumi/80 w-full md:w-44"
            >
              <option value="">Semua Status Risiko</option>
              <option value="Aman">Status: Aman</option>
              <option value="Berisiko">Status: Berisiko</option>
            </select>
          </div>
        </div>

        {/* Table Container (Bento Style) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-ai mb-2" />
              <p className="text-sm text-sumi/60">Mengevaluasi basis data melalui model biner...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-20 text-center text-sm text-sumi/50">
              Tidak ada data mahasiswa yang mencocokkan kriteria pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-washi/20 text-xs font-semibold uppercase tracking-wider text-sumi/60">
                    <th className="py-4 px-6">Mahasiswa</th>
                    <th className="py-4 px-6">IPK Saat Ini</th>
                    <th className="py-4 px-6">Kehadiran</th>
                    <th className="py-4 px-6">SKS Lulus</th>
                    <th className="py-4 px-6">Prediksi Kelulusan</th>
                    <th className="py-4 px-6">Proyeksi IPK</th>
                    <th className="py-4 px-6 text-right">Status Risiko</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {students.map((student) => (
                    <tr key={student.nim} className="hover:bg-washi/20 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-sumi group-hover:text-ai transition-colors">
                          <Link href={`/students/${student.nim}`} className="hover:underline text-ai">
                            {student.nama}
                          </Link>
                        </div>
                        <div className="text-xs text-sumi/50 mt-0.5">NIM {student.nim} • {student.kelas}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-sumi/80">{student.ipk_saat_ini.toFixed(2)}</td>
                      <td className="py-4 px-6 text-sumi/70">{student.persentase_hadir}%</td>
                      <td className="py-4 px-6 text-sumi/70">{student.sks_lulus} SKS</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${
                          student.prediksi.kelulusan === "Tepat Waktu" ? "text-matcha" : "text-sumi/60"
                        }`}>
                          {student.prediksi.kelulusan}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-ai">
                        {student.prediksi.proyeksi_ipk_depan.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          student.prediksi.status_risiko === "Aman" 
                            ? "bg-matcha/10 text-matcha" 
                            : "bg-aka/10 text-aka"
                        }`}>
                          {student.prediksi.status_risiko === "Aman" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {student.prediksi.status_risiko}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}