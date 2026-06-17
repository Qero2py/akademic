"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const nim = params?.nim as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    kelas: "",
    ipk_saat_ini: "",
    persentase_hadir: "",
    nilai_tugas: "",
    sks_lulus: "",
  });

  // Ambil data lama dari database untuk mengisi form (Pre-fill)
  useEffect(() => {
    if (!nim) return;

    const fetchStudentData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/students/${nim}`);
        if (!response.ok) throw new Error("Gagal mengambil data mahasiswa");
        
        const data = await response.json();
        setFormData({
          nim: data.nim,
          nama: data.nama,
          kelas: data.kelas,
          ipk_saat_ini: data.metrik_akademik.ipk_saat_ini.toString(),
          persentase_hadir: data.metrik_akademik.persentase_hadir.toString(),
          nilai_tugas: data.metrik_akademik.nilai_tugas.toString(),
          sks_lulus: data.metrik_akademik.sks_lulus.toString(),
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchStudentData();
  }, [nim]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/students/${nim}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: formData.nim, // NIM tidak boleh diubah (sebagai primary key)
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
        throw new Error(errData.detail || "Gagal memperbarui data");
      }

      // Jika sukses, arahkan kembali ke halaman detail mahasiswa tersebut
      router.push(`/students/${nim}`);
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi text-sumi">
        <Loader2 className="w-8 h-8 animate-spin text-ai mb-2" />
        <p className="text-sm font-medium">Membaca metrik mahasiswa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-washi text-sumi">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <Link href={`/students/${nim}`} className="inline-flex items-center text-sm font-medium text-sumi/70 hover:text-ai transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" /> Batal & Kembali
          </Link>
        </div>

        <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold tracking-tight">Edit Data & Evaluasi Ulang</h1>
          <p className="text-sm text-sumi/60 mt-1 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-ai" />
            AI akan menghitung ulang klasifikasi risiko berdasarkan metrik terbaru.
          </p>
        </header>

        {error && (
          <div className="p-4 bg-aka/10 text-aka rounded-2xl text-sm font-medium border border-aka/20">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input NIM (Disabled / Tidak bisa diubah) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">NIM Mahasiswa</label>
              <input disabled type="text" value={formData.nim} 
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-sumi/50 cursor-not-allowed" />
            </div>

            {/* Input Nama */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Nama Lengkap</label>
              <input required type="text" name="nama" value={formData.nama} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" />
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
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Persentase Kehadiran (%)</label>
              <input required type="number" step="0.1" min="0" max="100" name="persentase_hadir" value={formData.persentase_hadir} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Rata-rata Nilai Tugas</label>
              <input required type="number" step="0.1" min="0" max="100" name="nilai_tugas" value={formData.nilai_tugas} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sumi/80">Total SKS Lulus</label>
              <input required type="number" min="0" name="sks_lulus" value={formData.sks_lulus} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-washi/50 border border-gray-200 rounded-xl text-sm focus:border-ai focus:outline-none transition-colors" />
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-ai text-white rounded-xl text-sm font-semibold hover:bg-ai/90 disabled:bg-ai/50 transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Memproses..." : "Perbarui & Evaluasi"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}