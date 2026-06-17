"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    kelas: "5A - STI",
    ipk_saat_ini: "",
    persentase_hadir: "",
    nilai_tugas: "",
    sks_lulus: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: formData.nim,
          nama: formData.nama,
          kelas: formData.kelas,
          ipk_saat_ini: parseFloat(formData.ipk_saat_ini),
          persentase_hadir: parseFloat(formData.persentase_hadir),
          nilai_tugas: parseFloat(formData.nilai_tugas),
          sks_lulus: parseInt(formData.sks_lulus),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Gagal menyimpan data");
      }

      // Jika sukses, arahkan kembali ke halaman tabel mahasiswa
      router.push("/students");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-washi text-sumi">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <Link href="/students" className="inline-flex items-center text-sm font-medium text-sumi/70 hover:text-ai transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" /> Batal & Kembali
          </Link>
        </div>

        <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold tracking-tight">Registrasi Data Akademik</h1>
          <p className="text-sm text-sumi/60 mt-1 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-ai" />
            AI akan otomatis mengevaluasi risiko setelah data disimpan.
          </p>
        </header>

        {error && (
          <div className="p-4 bg-aka/10 text-aka rounded-2xl text-sm font-medium border border-aka/20">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input NIM */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">NIM Mahasiswa</label>
              <input required type="text" name="nim" value={formData.nim} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" placeholder="Contoh: 2303045001" />
            </div>

            {/* Input Nama */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Nama Lengkap</label>
              <input required type="text" name="nama" value={formData.nama} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" placeholder="Nama Mahasiswa" />
            </div>

            {/* Input Kelas */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-sumi/80">Kelas / Program Studi</label>
              <input required type="text" name="kelas" value={formData.kelas} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" />
            </div>

            {/* Input Metrik Akademik */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">IPK Saat Ini</label>
              <input required type="number" step="0.01" min="0" max="4" name="ipk_saat_ini" value={formData.ipk_saat_ini} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" placeholder="0.00 - 4.00" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Persentase Kehadiran (%)</label>
              <input required type="number" step="0.1" min="0" max="100" name="persentase_hadir" value={formData.persentase_hadir} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" placeholder="0 - 100" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Rata-rata Nilai Tugas</label>
              <input required type="number" step="0.1" min="0" max="100" name="nilai_tugas" value={formData.nilai_tugas} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" placeholder="0 - 100" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Total SKS Lulus</label>
              <input required type="number" min="0" name="sks_lulus" value={formData.sks_lulus} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" placeholder="Contoh: 80" />
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-ai text-white rounded-xl text-sm font-semibold hover:bg-ai/90 disabled:bg-ai/50 transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Menganalisis..." : "Simpan & Evaluasi AI"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}