import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  FileArchive, 
  Image as ImageIcon, 
  FileCheck, 
  Download, 
  Eye, 
  MoreVertical, 
  Trash2, 
  CloudCheck, 
  ExternalLink, 
  ShieldAlert, 
  Lock,
  CheckSquare,
  Square,
  FileSpreadsheet as ExportIcon
} from 'lucide-react';
import { DocumentItem, CategoryInfo } from '../types';
import { formatBytes } from '../lib/storage';

interface DocumentTableProps {
  documents: DocumentItem[];
  categories: CategoryInfo[];
  isUnlocked: boolean;
  onOpenUnlockModal: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (doc: DocumentItem) => void;
  onBatchDownload: (docIds: string[]) => void;
  onBatchExportCSV: (docs: DocumentItem[]) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  categories,
  isUnlocked,
  onOpenUnlockModal,
  onSelectDocument,
  onDownloadDocument,
  onDeleteDocument,
  onBatchDownload,
  onBatchExportCSV,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getCategoryBadgeClass = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    return cat ? cat.color : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  const renderFileIcon = (fileType: DocumentItem['fileType']) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'ppt':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-amber-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-slate-500" />;
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === documents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(documents.map((d) => d.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // If locked, render blurred or locked overlay table
  if (!isUnlocked) {
    return (
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Backdrop overlay */}
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 shadow-lg shadow-rose-500/10 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Rekap Dokumen Terproteksi Kata Sandi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
            Informasi detail, rekapitulasi, dan berkas yang tersimpan dikunci untuk menjaga privasi dan keamanan data. Masukkan password untuk membuka.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onOpenUnlockModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Masukkan Password (Default: admin)</span>
            </button>
          </div>
        </div>

        {/* Dummy Blurred Table Background */}
        <div className="filter blur-sm select-none pointer-events-none p-4 opacity-40">
          <table className="w-full text-left text-xs text-slate-500">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3">Nama Dokumen</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">No. Surat</th>
                <th className="p-3">Ukuran</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Pengunggah</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-3 font-semibold text-slate-800">Dokumen Rahasia #{i}.pdf</td>
                  <td className="p-3"><span className="px-2 py-1 bg-slate-200 rounded">Kategori #{i}</span></td>
                  <td className="p-3">SK/00{i}/ADMIN/2026</td>
                  <td className="p-3">2.{i} MB</td>
                  <td className="p-3">2026-07-20</td>
                  <td className="p-3">Admin Sistem</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Tidak Ada Dokumen Ditemukan
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Belum ada berkas tersimpan atau hasil pencarian tidak sesuai dengan kata kunci filter.
        </p>
      </div>
    );
  }

  const selectedDocsList = documents.filter((d) => selectedIds.includes(d.id));

  return (
    <div className="space-y-3">
      
      {/* Batch Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>{selectedIds.length} Dokumen Dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBatchDownload(selectedIds)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Terpilih</span>
            </button>
            <button
              onClick={() => onBatchExportCSV(selectedDocsList)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ExportIcon className="w-3.5 h-3.5" />
              <span>Ekspor Rekap (CSV)</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      )}

      {/* Main Rekapitulasi Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3.5 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Pilih Semua Dokumen"
                  >
                    {selectedIds.length === documents.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 min-w-[240px]">Dokumen & Format</th>
                <th className="py-3 px-3.5">Kategori</th>
                <th className="py-3 px-3.5">No. Dokumen / Ref</th>
                <th className="py-3 px-3.5 min-w-[180px]">Ringkasan / Keterangan</th>
                <th className="py-3 px-3.5">Ukuran</th>
                <th className="py-3 px-3.5">Tanggal & Uploader</th>
                <th className="py-3 px-3.5 text-center">Status & Sync</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {documents.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                return (
                  <tr 
                    key={doc.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    
                    {/* Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={() => toggleSelectOne(doc.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Title & File Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 mt-0.5">
                          {renderFileIcon(doc.fileType)}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => onSelectDocument(doc)}
                            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-left line-clamp-1 transition-colors"
                          >
                            {doc.title}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono">{doc.fileName}</span>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="hidden lg:flex items-center gap-1">
                                {doc.tags.slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${getCategoryBadgeClass(doc.category)}`}>
                        {doc.category}
                      </span>
                    </td>

                    {/* Doc Number */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {doc.docNumber || '-'}
                    </td>

                    {/* Description Note */}
                    <td className="py-3 px-3.5 max-w-xs">
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-[11px] leading-relaxed">
                        {doc.description || 'Tidak ada catatan keterangan.'}
                      </p>
                    </td>

                    {/* File Size */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                      {formatBytes(doc.fileSize)}
                    </td>

                    {/* Date & Uploader */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{doc.uploadDate}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{doc.uploader}</div>
                    </td>

                    {/* Status & Drive Sync */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          doc.status === 'Rahasia' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                          doc.status === 'Arsip' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {doc.status}
                        </span>
                        {doc.isSyncedToDrive && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <CloudCheck className="w-3 h-3" />
                            <span>Drive</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Download & Options */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Download CTA Button */}
                        <button
                          onClick={() => onDownloadDocument(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all"
                          title="Unduh Berkas Ini"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => onSelectDocument(doc)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
                          title="Lihat Detail & Pratinjau"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button (Restricted with Password) */}
                        <button
                          onClick={() => onDeleteDocument(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-all"
                          title="Hapus Berkas (Restriksi Password)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
