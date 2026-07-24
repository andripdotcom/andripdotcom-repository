import React from 'react';
import { Search, X, Filter, LayoutGrid, LayoutList, ArrowUpDown, Calendar } from 'lucide-react';
import { DocumentFilter, CategoryInfo } from '../types';

interface QuickSearchFilterProps {
  filter: DocumentFilter;
  onFilterChange: (updated: Partial<DocumentFilter>) => void;
  onResetFilter: () => void;
  categories: CategoryInfo[];
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  totalFilteredCount: number;
  totalAllCount: number;
}

export const QuickSearchFilter: React.FC<QuickSearchFilterProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  categories,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalAllCount,
}) => {
  const hasActiveFilters = 
    filter.query !== '' || 
    filter.category !== '' || 
    filter.fileType !== '' || 
    filter.status !== '' || 
    filter.dateFrom !== '' || 
    filter.dateTo !== '';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 space-y-3.5">
      
      {/* Top Search & Primary Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filter.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            placeholder="Pencarian cepat (Nama dokumen, no. surat, kata kunci, uploader)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {filter.query && (
            <button
              onClick={() => onFilterChange({ query: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher & Sort */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          
          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan Tabel Rekapitulasi Lengkap"
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel Rekap</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan Kartu Visual"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid Kartu</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="appearance-none pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="date-desc">Terbaru Diunggah</option>
              <option value="date-asc">Terlama Diunggah</option>
              <option value="title-asc">Nama Dokumen A-Z</option>
              <option value="size-desc">Ukuran Terbesar</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Advanced Secondary Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        
        {/* Category Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Kategori Berkas
          </label>
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Format Type */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Format File
          </label>
          <select
            value={filter.fileType}
            onChange={(e) => onFilterChange({ fileType: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Format</option>
            <option value="pdf">PDF Document (.pdf)</option>
            <option value="doc">Word Document (.doc, .docx)</option>
            <option value="xls">Spreadsheet Excel (.xls, .xlsx, .csv)</option>
            <option value="ppt">PowerPoint (.ppt, .pptx)</option>
            <option value="image">Gambar (.jpg, .png, .svg)</option>
            <option value="archive">Arsip (.zip, .rar)</option>
            <option value="text">Teks / Catatan (.txt)</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Status Berkas
          </label>
          <select
            value={filter.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Arsip">Arsip</option>
            <option value="Rahasia">Rahasia</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Clear Filters Reset */}
        <div className="flex items-end">
          {hasActiveFilters ? (
            <button
              onClick={onResetFilter}
              className="w-full py-1.5 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 py-1.5 px-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Menampilkan {totalFilteredCount} dari {totalAllCount} dokumen</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
