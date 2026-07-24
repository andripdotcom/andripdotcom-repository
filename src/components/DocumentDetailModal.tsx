import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  CloudCheck, 
  Calendar, 
  User, 
  Tag, 
  HardDrive, 
  Info,
  ShieldCheck,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { DocumentItem, CategoryInfo } from '../types';
import { formatBytes } from '../lib/storage';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete?: (doc: DocumentItem) => void;
  categories: CategoryInfo[];
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document: doc,
  onClose,
  onDownload,
  onDelete,
  categories,
}) => {
  const [copied, setCopied] = useState(false);

  if (!doc) return null;

  const getCategoryBadgeClass = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    return cat ? cat.color : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(doc.downloadUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(doc.category)}`}>
                  {doc.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  doc.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' :
                  doc.status === 'Rahasia' ? 'bg-rose-100 text-rose-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {doc.status}
                </span>
                {doc.isSyncedToDrive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CloudCheck className="w-3 h-3" />
                    <span>Synced Drive</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {doc.title}
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                {doc.fileName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Info Cards Grid */}
        <div className="my-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              No. Dokumen / Ref
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {doc.docNumber || '-'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Ukuran Berkas
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {formatBytes(doc.fileSize)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Tanggal Unggah
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {doc.uploadDate}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Pengunggah
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
              {doc.uploader}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Format Tipe Berkas
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
              {doc.fileType} ({doc.mimeType})
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Keterangan / Catatan Informasi</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {doc.description || 'Tidak ada catatan keterangan tambahan.'}
          </p>

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Tag:</span>
              {doc.tags.map((t, idx) => (
                <span key={idx} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Visual Preview Box if image */}
        {doc.fileType === 'image' && doc.downloadUrl && (
          <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-2 text-center">
            <img src={doc.downloadUrl} alt={doc.title} className="max-h-60 mx-auto rounded-lg object-contain" />
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan Data'}</span>
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(doc);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900 transition-all"
                title="Hapus Dokumen Ini (Restriksi Password)"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Berkas</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Tutup
            </button>
            <button
              onClick={() => onDownload(doc)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
