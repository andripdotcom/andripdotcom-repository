import React from 'react';
import { Files, HardDrive, FolderOpen, CloudCheck, ShieldCheck, Tag } from 'lucide-react';
import { DocumentItem, CategoryInfo } from '../types';
import { formatBytes } from '../lib/storage';

interface RecapAnalyticsProps {
  documents: DocumentItem[];
  categories: CategoryInfo[];
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
  isUnlocked: boolean;
}

export const RecapAnalytics: React.FC<RecapAnalyticsProps> = ({
  documents,
  categories,
  selectedCategory,
  onSelectCategory,
  isUnlocked,
}) => {
  const totalDocs = documents.length;
  const totalSizeBytes = documents.reduce((acc, d) => acc + (d.fileSize || 0), 0);
  const totalDriveSynced = documents.filter((d) => d.isSyncedToDrive || d.googleDriveId).length;

  // Calculate category breakdown
  const categoryCounts = categories.map((cat) => {
    const count = documents.filter((d) => d.category === cat.name).length;
    return { ...cat, count };
  });

  return (
    <div className="space-y-4 mb-6">
      
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Documents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Dokumen
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Files className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {isUnlocked ? totalDocs : '***'}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Tersimpan
            </span>
          </div>
        </div>

        {/* Total Storage Used */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ukuran Total Berkas
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {isUnlocked ? formatBytes(totalSizeBytes) : '*** MB'}
            </div>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
              Kapasitas
            </span>
          </div>
        </div>

        {/* Categories Count */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Kategori Terdata
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {categories.length}
            </div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              Terstruktur
            </span>
          </div>
        </div>

        {/* Google Drive Sync Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Synced Drive
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CloudCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {isUnlocked ? totalDriveSynced : '***'}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Google Drive
            </span>
          </div>
        </div>

      </div>

      {/* Category Quick Filter Pills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Tag className="w-3.5 h-3.5 text-blue-500" />
            <span>Kategori Dokumen Utama:</span>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory('')}
              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filter Kategori
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All Filter Button */}
          <button
            onClick={() => onSelectCategory('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              selectedCategory === ''
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
            }`}
          >
            <span>Semua Berkas</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200/60 dark:bg-slate-700/60 font-semibold">
              {totalDocs}
            </span>
          </button>

          {/* Individual Category Buttons */}
          {categoryCounts.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
