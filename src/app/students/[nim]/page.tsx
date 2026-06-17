"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, GraduationCap, Calendar, BookOpen, Percent, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface MetrikAkademik {
  ipk_saat_ini: number;
  persentase_hadir: number;
  nilai_tugas: number;
  sks_lulus: number;
}

interface KesimpulanAI {
  status_risiko: string;
  proyeksi_kelulusan: string;
  estimasi_ipk_semester_depan: number;
  faktor_pemicu: string[];
}

interface StudentDetail {
  nim: string;
  nama: string;
  kelas: string;
  metrik_akademik: MetrikAkademik;
  kesimpulan_ai: KesimpulanAI;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nim = params?.nim as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nim) return;

    const fetchStudentDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/students/${nim}`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error("Data mahasiswa tidak ditemukan");
          throw new Error("Gagal mengambil detail data dari server");
        }
        
        const data = await response.json();
        setStudent(data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan sistem");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [nim]);

  // Fungsi untuk Menghapus Data Mahasiswa
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus data mahasiswa dengan NIM ${nim}?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/students/${nim}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Gagal menghapus data");
      }

      // Kembali ke daftar mahasiswa setelah sukses dihapus
      router.push("/students");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi text-sumi">
        <Loader2 className="w-8 h-8 animate-spin text-ai mb-2" />
        <p className="text-sm font-medium">Mengekstrak pohon keputusan dan proyeksi regresi...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi p-4 text-center">
        <div className="p-4 bg-aka/10 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-aka" />
        </div>
        <h2 className="text-xl font-bold">{error || "Data Tidak Ditemukan"}</h2>
        <Link href="/students" className="mt-5 px-4 py-2 bg-ai text-white rounded-xl text-sm font-medium hover:bg-ai/90 transition-colors">
          Kembali ke Database
        </Link>
      </div>
    );
  }
  
  const isBerisiko = student.kesimpulan_ai?.status_risiko === "Berisiko";
  const infoAi = student.kesimpulan_ai;
  const metrik = student.metrik_akademik;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-washi text-sumi">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigasi Atas */}
        <div>
          <Link href="/students" className="inline-flex items-center text-sm font-medium text-sumi/70 hover:text-ai transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Mahasiswa
          </Link>
        </div>

        {/* Header Profil & Grup Tombol Aksi */}
        <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sumi/50 tracking-wider block mb-1">PROFIL MAHASISWA</span>
            <h1 className="text-3xl font-bold tracking-tight">{student.nama}</h1>
            <p className="text-sm text-sumi/60 mt-1 mb-4">NIM {student.nim} • Kelas {student.kelas}</p>
            
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold tracking-wide shadow-sm ${
              isBerisiko ? "bg-aka/10 text-aka border border-aka/20" : "bg-matcha/10 text-matcha border border-matcha/20"
            }`}>
              {isBerisiko ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              Klasifikasi Sistem: {infoAi.status_risiko}
            </span>
          </div>
          
          {/* Tombol Edit & Hapus */}
          <div className="flex items-center gap-2 self-start sm:self-auto mt-2 sm:mt-0">
            <Link 
              href={`/students/${nim}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-washi text-sumi hover:bg-washi/70 border border-gray-200 rounded-xl text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Metrik
            </Link>
            <button 
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDF5F5] text-aka hover:bg-aka hover:text-white border border-[#FAD4D4] rounded-xl text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </button>
          </div>
        </header>

        {/* Grid Informasi Utama */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* SISI KIRI: Analisis AI & Pohon Keputusan (Span 7) */}
          <div className="md:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Kartu Khusus Alasan AI (Decision Tree Explainable Output) */}
            <div className={`p-6 rounded-3xl shadow-sm border flex-1 flex flex-col justify-between ${
              isBerisiko ? "bg-[#FDF5F5] border-[#FAD4D4]" : "bg-[#F5F8F6] border-[#D4E2D8]"
            }`}>
              <div>
                <h3 className={`font-bold text-lg mb-3 ${isBerisiko ? "text-aka" : "text-matcha"}`}>
                  Interpretasi Logika Decision Tree
                </h3>
                <p className="text-sm text-sumi/70 mb-4 leading-relaxed">
                  Faktor pemicu utama yang dideteksi oleh simpul internal model algoritma berdasarkan data aktivitas semester berjalan:
                </p>
                <ul className="space-y-3">
                  {infoAi.faktor_pemicu.map((alasan, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2.5 text-sumi/80 font-medium bg-white/60 p-3 rounded-xl border border-gray-100">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isBerisiko ? "bg-aka" : "bg-matcha"}`}></span>
                      {alasan}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-[11px] font-mono text-sumi/40 mt-6 pt-3 border-t border-gray-200/50">
                MODEL ID: DECISION_TREE_RISK_V5
              </div>
            </div>

            {/* Proyeksi Kelulusan (Random Forest Output) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-washi rounded-2xl text-matcha">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Estimasi Kelulusan</h4>
                  <p className="text-xs text-sumi/60">Komputasi ansambel Random Forest</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                infoAi.proyeksi_kelulusan === "Tepat Waktu" ? "bg-matcha/10 text-matcha" : "bg-aka/10 text-aka"
              }`}>
                {infoAi.proyeksi_kelulusan}
              </span>
            </div>

          </div>

          {/* SISI KANAN: Skor & Proyeksi Linear Regression (Span 5) */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Indikator Akademik</h3>
              <p className="text-sm text-sumi/60 mb-6">Variabel numerik input latih</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-washi/30 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-2.5 text-sm text-sumi/70">
                    <BookOpen className="w-4 h-4 text-ai" /> IPK Saat Ini
                  </div>
                  <span className="font-bold text-sumi">{metrik.ipk_saat_ini.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-washi/30 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-2.5 text-sm text-sumi/70">
                    <Percent className="w-4 h-4 text-ai" /> Rasio Kehadiran
                  </div>
                  <span className="font-bold text-sumi">{metrik.persentase_hadir}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-washi/30 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-2.5 text-sm text-sumi/70">
                    <Calendar className="w-4 h-4 text-ai" /> Beban Kredit Lulus
                  </div>
                  <span className="font-bold text-sumi">{metrik.sks_lulus} SKS</span>
                </div>
              </div>
            </div>

            {/* Kotak Proyeksi Linear Regression */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center bg-washi/40 p-4 rounded-2xl border border-dashed border-gray-200">
              <span className="text-xs font-mono text-sumi/50 tracking-wide uppercase block mb-1">PROYEKSI REGRESI SEMESTER DEPAN</span>
              <div className="text-3xl font-black text-ai tracking-tight">
                {infoAi.estimasi_ipk_semester_depan.toFixed(2)}
              </div>
              <p className="text-[11px] text-sumi/50 mt-1.5 max-w-xs mx-auto">
                Prediksi nilai kontinu berdasarkan tren korelasi linier aktivitas dan riwayat akumulasi nilai tugas.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}