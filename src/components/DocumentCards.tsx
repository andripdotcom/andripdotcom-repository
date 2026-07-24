import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  FileArchive, 
  Image as ImageIcon, 
  FileCheck, 
  Download, 
  Eye, 
  CloudCheck, 
  Lock,
  Trash2
} from 'lucide-react';
import { DocumentItem, CategoryInfo } from '../types';
import { formatBytes } from '../lib/storage';

interface DocumentCardsProps {
  documents: DocumentItem[];
  categories: CategoryInfo[];
  isUnlocked: boolean;
  onOpenUnlockModal: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (doc: DocumentItem) => void;
}

export const DocumentCards: React.FC<DocumentCardsProps> = ({
  documents,
  categories,
  isUnlocked,
  onOpenUnlockModal,
  onSelectDocument,
  onDownloadDocument,
  onDeleteDocument,
}) => {
  const getCategoryBadgeClass = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    return cat ? cat.color : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  const renderFileIcon = (fileType: DocumentItem['fileType']) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-rose-500" />;
      case 'xls':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      case 'doc':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'ppt':
        return <FileText className="w-6 h-6 text-amber-500" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-purple-500" />;
      case 'archive':
        return <FileArchive className="w-6 h-6 text-amber-600" />;
      default:
        return <FileCheck className="w-6 h-6 text-slate-500" />;
    }
  };

  if (!isUnlocked) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 text-rose-600 flex items-center justify-center mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Akses Rekap Kartu Terkunci
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
          Silakan buka akses rekapitulasi dengan memasukkan password untuk melihat tampilan kartu berkas.
        </p>
        <button
          onClick={onOpenUnlockModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
        >
          
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Tidak ada dokumen ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            {/* Top Bar: Category Badge & Status */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(doc.category)}`}>
                {doc.category}
              </span>
              <div className="flex items-center gap-1">
                {doc.isSyncedToDrive && (
                  <span className="p-1 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" title="Tersinkronisasi ke Google Drive">
                    <CloudCheck className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  doc.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' :
                  doc.status === 'Rahasia' ? 'bg-rose-100 text-rose-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>

            {/* Icon & Title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                {renderFileIcon(doc.fileType)}
              </div>
              <div className="min-w-0">
                <button
                  onClick={() => onSelectDocument(doc)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left line-clamp-2 transition-colors"
                >
                  {doc.title}
                </button>
                <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {doc.fileName}
                </p>
              </div>
            </div>

            {/* Description note */}
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
              {doc.description || 'Tidak ada catatan keterangan.'}
            </p>

            {/* Metadata Info Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-[11px] space-y-1 mb-4 border border-slate-100 dark:border-slate-800">
              {doc.docNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Surat:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{doc.docNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Ukuran Berkas:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{formatBytes(doc.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Upload:</span>
                <span className="text-slate-700 dark:text-slate-200">{doc.uploadDate}</span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onSelectDocument(doc)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail</span>
            </button>
            <button
              onClick={() => onDownloadDocument(doc)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </button>
            <button
              onClick={() => onDeleteDocument(doc)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-400 hover:border-rose-200 dark:hover:border-rose-800 border border-transparent transition-all"
              title="Hapus Berkas (Restriksi Password)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};
