"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, BarChart3, BrainCircuit, ShieldCheck, Cpu, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ClassificationMetrics {
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
}

interface RegressionMetrics {
  mean_squared_error: number;
  r2_score: number;
}

interface MetricsData {
  decision_tree_classification: ClassificationMetrics;
  random_forest_classification: ClassificationMetrics;
  linear_regression_analytics: RegressionMetrics;
}

export default function ModelsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Ambil data log evaluasi dari backend
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/models/metrics`);
      if (!response.ok) throw new Error("Gagal memuat metrik evaluasi");
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Fungsi untuk memicu pelatihan ulang (Retrain)
  const handleRetrain = async () => {
    try {
      setIsRetraining(true);
      setSuccessMessage(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/models/retrain`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Gagal melatih ulang model");
      
      const result = await response.json();
      setMetrics(result.evaluasi_terbaru);
      setSuccessMessage("Hot-Reload Sukses! Semua model berhasil dilatih ulang dengan basis data terbaru.");
      
      // Hilangkan pesan sukses setelah 5 detik
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error retraining models:", error);
      alert("Terjadi kesalahan saat melatih ulang model.");
    } finally {
      setIsRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi text-sumi">
        <Loader2 className="w-8 h-8 animate-spin text-ai mb-2" />
        <p className="text-sm font-medium">Membaca log performa algoritma...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-washi text-sumi">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-sumi/70 hover:text-ai transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Overview
          </Link>
          <div className="text-xs text-sumi/50 font-mono">CORE ENGINE: SCIKIT-LEARN V1.3+</div>
        </div>

        {/* Header & Tombol Retrain Kontrol */}
        <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen & Evaluasi Model</h1>
            <p className="text-sm text-sumi/60 mt-1">Pantau tingkat akurasi matematis dan kelola pembaruan bobot algoritma AI</p>
          </div>
          
          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="inline-flex items-center gap-2 px-5 py-3 bg-ai text-white rounded-2xl text-sm font-semibold hover:bg-ai/90 disabled:bg-ai/50 transition-all shadow-sm shrink-0 self-start sm:self-auto"
          >
            {isRetraining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses Komputasi...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Jalankan Pelatihan Ulang (Retrain)
              </>
            )}
          </button>
        </header>

        {/* Toast Notifikasi Sukses */}
        {successMessage && (
          <div className="bg-[#F5F8F6] border border-[#D4E2D8] text-matcha p-4 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Bento Grid Evaluasi Model */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* KARTU 1: Decision Tree - Klasifikasi Mahasiswa Berisiko (Span 6) */}
          <div className="md:col-span-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-washi rounded-xl text-ai">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Decision Tree Classifier</h3>
                  <p className="text-xs text-sumi/50">Fitur: Klasifikasi Mahasiswa Berisiko</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-sumi/70">Akurasi Model (Accuracy)</span>
                    <span className="font-bold text-sumi">{metrics?.decision_tree_classification.accuracy}%</span>
                  </div>
                  <div className="w-full bg-washi h-2 rounded-full overflow-hidden">
                    <div className="bg-ai h-full transition-all duration-500" style={{ width: `${metrics?.decision_tree_classification.accuracy}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="bg-washi/30 p-3 rounded-xl border border-gray-50 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sumi/50 block">F1-Score</span>
                    <span className="text-sm font-bold mt-1 block">{metrics?.decision_tree_classification.f1_score}%</span>
                  </div>
                  <div className="bg-washi/30 p-3 rounded-xl border border-gray-50 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sumi/50 block">Precision</span>
                    <span className="text-sm font-bold mt-1 block">{metrics?.decision_tree_classification.precision}%</span>
                  </div>
                  <div className="bg-washi/30 p-3 rounded-xl border border-gray-50 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sumi/50 block">Recall</span>
                    <span className="text-sm font-bold mt-1 block">{metrics?.decision_tree_classification.recall}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-sumi/40 mt-6 pt-3 border-t border-gray-50">
              CRITERION: GINI | MAX_DEPTH: 5
            </div>
          </div>

          {/* KARTU 2: Random Forest - Prediksi Kelulusan (Span 6) */}
          <div className="md:col-span-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-washi rounded-xl text-matcha">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Random Forest Classifier</h3>
                  <p className="text-xs text-sumi/50">Fitur: Prediksi Kelulusan Tepat Waktu</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-sumi/70">Akurasi Model (Accuracy)</span>
                    <span className="font-bold text-matcha">{metrics?.random_forest_classification.accuracy}%</span>
                  </div>
                  <div className="w-full bg-washi h-2 rounded-full overflow-hidden">
                    <div className="bg-matcha h-full transition-all duration-500" style={{ width: `${metrics?.random_forest_classification.accuracy}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="bg-washi/30 p-3 rounded-xl border border-gray-50 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sumi/50 block">F1-Score</span>
                    <span className="text-sm font-bold mt-1 block">{metrics?.random_forest_classification.f1_score}%</span>
                  </div>
                  <div className="bg-washi/30 p-3 rounded-xl border border-gray-50 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sumi/50 block">Precision</span>
                    <span className="text-sm font-bold mt-1 block">{metrics?.random_forest_classification.precision}%</span>
                  </div>
                  <div className="bg-washi/30 p-3 rounded-xl border border-gray-50 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sumi/50 block">Recall</span>
                    <span className="text-sm font-bold mt-1 block">{metrics?.random_forest_classification.recall}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-sumi/40 mt-6 pt-3 border-t border-gray-50">
              N_ESTIMATORS: 100 | RANDOM_STATE: 42
            </div>
          </div>

          {/* KARTU 3: Linear Regression - Proyeksi IPK (Span 12 / Baris Penuh bawah) */}
          <div className="md:col-span-12 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-washi rounded-xl text-sumi">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Linear Regression Analytics</h3>
                  <p className="text-xs text-sumi/50">Fitur: Estimasi IPK Semester Depan</p>
                </div>
              </div>
              <p className="text-xs text-sumi/60 mt-3 leading-relaxed">
                Menggunakan pendekatan matematis kontinu untuk melihat tren linier pergerakan nilai berdasarkan akumulasi tugas mahasiswa.
              </p>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-washi/40 p-4 rounded-2xl border border-gray-100 text-center">
                <span className="text-xs font-semibold text-sumi/50 block">Mean Squared Error (MSE)</span>
                <span className="text-2xl font-black text-aka mt-1 block">{metrics?.linear_regression_analytics.mean_squared_error}</span>
                <span className="text-[10px] text-sumi/40 block mt-1">Semakin mendekati 0, nilai presensi prediksi semakin sempurna</span>
              </div>
              
              <div className="bg-washi/40 p-4 rounded-2xl border border-gray-100 text-center">
                <span className="text-xs font-semibold text-sumi/50 block">R-Squared (R² Score)</span>
                <span className="text-2xl font-black text-ai mt-1 block">{metrics?.linear_regression_analytics.r2_score}</span>
                <span className="text-[10px] text-sumi/40 block mt-1">Mengukur seberapa baik variabilitas data dapat dijelaskan model</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}