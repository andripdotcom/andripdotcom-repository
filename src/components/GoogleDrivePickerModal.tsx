import React, { useState, useEffect } from 'react';
import { X, Cloud, Download, RefreshCw, FileText, CheckCircle2, AlertCircle, ExternalLink, Plus } from 'lucide-react';
import { DriveFileItem, DocumentItem, DocumentCategory } from '../types';

interface GoogleDrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDriveConnected: boolean;
  accessToken: string | null;
  onGoogleSignIn: () => void;
  onImportDriveFile: (doc: DocumentItem) => void;
}

export const GoogleDrivePickerModal: React.FC<GoogleDrivePickerModalProps> = ({
  isOpen,
  onClose,
  isDriveConnected,
  accessToken,
  onGoogleSignIn,
  onImportDriveFile,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [importedIds, setImportedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && isDriveConnected && accessToken) {
      fetchDriveFiles();
    }
  }, [isOpen, isDriveConnected, accessToken]);

  const fetchDriveFiles = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/drive/list', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil berkas Google Drive.');
      }

      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setErrorMsg(err.message || 'Gagal memuat berkas Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleImport = (file: DriveFileItem) => {
    const sizeInBytes = file.size ? parseInt(file.size, 10) : 1024 * 1024;
    let cat: DocumentCategory = 'Surat Masuk';
    if (file.mimeType.includes('spreadsheet') || file.mimeType.includes('excel')) cat = 'Laporan Keuangan';
    if (file.mimeType.includes('pdf')) cat = 'SOP & Regulasi';

    const newDoc: DocumentItem = {
      id: `drive-${file.id}`,
      title: file.name,
      docNumber: `DRIVE-${file.id.substring(0, 6).toUpperCase()}`,
      fileName: file.name,
      fileSize: sizeInBytes,
      fileType: file.mimeType.includes('pdf') ? 'pdf' : file.mimeType.includes('sheet') ? 'xls' : 'doc',
      mimeType: file.mimeType,
      category: cat,
      description: `Diimpor langsung dari Google Drive (Diedit: ${file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : 'Terbaru'}).`,
      uploader: 'Google Drive Sync',
      uploadDate: new Date().toISOString().split('T')[0],
      tags: ['GoogleDrive', 'CloudSync'],
      downloadUrl: file.webViewLink || '#',
      googleDriveId: file.id,
      googleDriveWebViewLink: file.webViewLink,
      status: 'Aktif',
      isSyncedToDrive: true,
    };

    onImportDriveFile(newDoc);
    setImportedIds([...importedIds, file.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Impor Dokumen dari Google Drive
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih berkas dari Google Drive untuk dimasukkan ke dalam rekapitulasi data.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="my-4 flex-1 overflow-y-auto">
          {!isDriveConnected ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Cloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Google Drive Belum Terhubung
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Masuk dengan akun Google Anda untuk membaca dan mengimpor dokumen langsung dari Google Drive.
              </p>
              <button
                onClick={onGoogleSignIn}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md inline-flex items-center gap-2"
              >
                <Cloud className="w-4 h-4" />
                <span>Masuk dengan Google Drive</span>
              </button>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
              <p>Memuat daftar berkas dari Google Drive...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Tidak ada berkas ditemukan di Google Drive.
            </div>
          ) : (
            <div className="space-y-2">
              {driveFiles.map((f) => {
                const isImported = importedIds.includes(f.id);
                return (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {f.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Format: {f.mimeType.split('.').pop() || 'Google Doc'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {f.webViewLink && (
                        <a
                          href={f.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Buka di Google Drive"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {isImported ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Telah Diimpor</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleImport(f)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Impor Berkas</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          {isDriveConnected && (
            <button
              onClick={fetchDriveFiles}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Berkas Drive</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl ml-auto"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
