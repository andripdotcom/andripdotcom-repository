/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  DocumentItem, 
  CategoryInfo, 
  DocumentFilter, 
  UserProfile 
} from './types';
import { 
  getStoredDocuments, 
  saveDocuments, 
  getStoredCategories, 
  saveCategories, 
  getStoredProfile, 
  saveStoredProfile,
  formatBytes
} from './lib/storage';
import { initAuth, googleSignIn, logoutGoogle } from './lib/firebase';
import { User } from 'firebase/auth';

import { Header } from './components/Header';
import { PasswordModal } from './components/PasswordModal';
import { RecapAnalytics } from './components/RecapAnalytics';
import { QuickSearchFilter } from './components/QuickSearchFilter';
import { DocumentTable } from './components/DocumentTable';
import { DocumentCards } from './components/DocumentCards';
import { UploadModal } from './components/UploadModal';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { GoogleDrivePickerModal } from './components/GoogleDrivePickerModal';
import { DeletePasswordModal } from './components/DeletePasswordModal';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  // App Login Session State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('doc_rekap_logged_in') === 'true';
  });

  // Application Data States
  const [documents, setDocuments] = useState<DocumentItem[]>(() => getStoredDocuments());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getStoredProfile());

  // Security Lock State (Default unlocked so user immediately sees rekap, but can lock or change password anytime)
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // View Mode State
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter & Search State
  const [filter, setFilter] = useState<DocumentFilter>({
    query: '',
    category: '',
    fileType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date-desc',
  });

  // Modal Control States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<DocumentItem | null>(null);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  // Google Drive Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        if (token) setDriveAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setDriveAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Show Toast Feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setDriveAccessToken(res.accessToken);
        showToast('Berhasil terhubung ke Google Drive!');
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      showToast(err.message || 'Gagal menghubungkan Google Drive.');
    }
  };

  // Lock Toggle
  const handleLockToggle = () => {
    if (isUnlocked) {
      setIsUnlocked(false);
      showToast('Akses Rekapitulasi Dokumen Terkunci');
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  // Document Operations
  const handleSaveNewDocument = (newDoc: DocumentItem) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveDocuments(updated);
    showToast(`Dokumen "${newDoc.title}" berhasil diunggah!`);
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = documents.filter((d) => d.id !== docId);
    setDocuments(updated);
    saveDocuments(updated);
    showToast('Dokumen berhasil dihapus dari rekapitulasi.');
  };

  const handleSaveCategories = (updatedCategories: CategoryInfo[]) => {
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    showToast('Daftar kategori berhasil diperbarui.');
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    showToast('Informasi profil berhasil disimpan.');
  };

  // Single File Download Handler
  const handleDownloadDocument = (doc: DocumentItem) => {
    if (!doc.downloadUrl) {
      showToast('Tautan berkas tidak tersedia.');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = doc.fileName || `${doc.title}.${doc.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Mengunduh berkas "${doc.fileName}"...`);
    } catch (e) {
      console.error('Download error:', e);
      window.open(doc.downloadUrl, '_blank');
    }
  };

  // Batch Download Selected Files
  const handleBatchDownload = (docIds: string[]) => {
    const targetDocs = documents.filter((d) => docIds.includes(d.id));
    targetDocs.forEach((doc, idx) => {
      setTimeout(() => {
        handleDownloadDocument(doc);
      }, idx * 400);
    });
    showToast(`Memulai unduhan ${targetDocs.length} berkas...`);
  };

  // Export Rekapitulasi as CSV File
  const handleBatchExportCSV = (docsToExport: DocumentItem[]) => {
    const headers = ['ID', 'Nama Dokumen', 'No Surat', 'Nama File', 'Kategori', 'Ukuran', 'Tanggal Upload', 'Pengunggah', 'Status', 'Keterangan'];
    const rows = docsToExport.map((d) => [
      `"${d.id}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${(d.docNumber || '').replace(/"/g, '""')}"`,
      `"${d.fileName.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      `"${formatBytes(d.fileSize)}"`,
      `"${d.uploadDate}"`,
      `"${d.uploader}"`,
      `"${d.status}"`,
      `"${(d.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Dokumen_Online_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Berhasil mengekspor rekapitulasi data (CSV)!');
  };

  // Filtering & Search Logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Query filter across fields
      if (filter.query) {
        const q = filter.query.toLowerCase().trim();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchFileName = doc.fileName.toLowerCase().includes(q);
        const matchDocNo = (doc.docNumber || '').toLowerCase().includes(q);
        const matchCategory = doc.category.toLowerCase().includes(q);
        const matchUploader = doc.uploader.toLowerCase().includes(q);
        const matchDesc = doc.description.toLowerCase().includes(q);
        const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchTitle && !matchFileName && !matchDocNo && !matchCategory && !matchUploader && !matchDesc && !matchTags) {
          return false;
        }
      }

      // Category filter
      if (filter.category && doc.category !== filter.category) {
        return false;
      }

      // File type filter
      if (filter.fileType && doc.fileType !== filter.fileType) {
        return false;
      }

      // Status filter
      if (filter.status && doc.status !== filter.status) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'date-desc') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (filter.sortBy === 'date-asc') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      }
      if (filter.sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (filter.sortBy === 'size-desc') {
        return b.fileSize - a.fileSize;
      }
      return 0;
    });
  }, [documents, filter]);

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          sessionStorage.setItem('doc_rekap_logged_in', 'true');
          showToast('Berhasil masuk ke aplikasi!');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Component */}
      <Header
        isUnlocked={isUnlocked}
        onLockToggle={handleLockToggle}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDrivePicker={() => setIsDrivePickerOpen(true)}
        userProfile={userProfile}
        isDriveConnected={!!googleUser}
        driveUserEmail={googleUser?.email || ''}
        onGoogleSignIn={handleGoogleSignIn}
        onLogout={() => {
          setIsLoggedIn(false);
          sessionStorage.removeItem('doc_rekap_logged_in');
          showToast('Berhasil keluar dari aplikasi.');
        }}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Analytics & Metrics Header */}
        <RecapAnalytics
          documents={documents}
          categories={categories}
          selectedCategory={filter.category}
          onSelectCategory={(catName) => setFilter({ ...filter, category: catName })}
          isUnlocked={isUnlocked}
        />

        {/* Quick Search & Filtering Bar */}
        <QuickSearchFilter
          filter={filter}
          onFilterChange={(updated) => setFilter({ ...filter, ...updated })}
          onResetFilter={() =>
            setFilter({
              query: '',
              category: '',
              fileType: '',
              status: '',
              dateFrom: '',
              dateTo: '',
              sortBy: 'date-desc',
            })
          }
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFilteredCount={filteredDocuments.length}
          totalAllCount={documents.length}
        />

        {/* Document Content View (Table vs Grid Cards) */}
        {viewMode === 'table' ? (
          <DocumentTable
            documents={filteredDocuments}
            categories={categories}
            isUnlocked={isUnlocked}
            onOpenUnlockModal={() => setIsPasswordModalOpen(true)}
            onSelectDocument={(doc) => setSelectedDocForDetail(doc)}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={(doc) => setDocToDelete(doc)}
            onBatchDownload={handleBatchDownload}
            onBatchExportCSV={handleBatchExportCSV}
          />
        ) : (
          <DocumentCards
            documents={filteredDocuments}
            categories={categories}
            isUnlocked={isUnlocked}
            onOpenUnlockModal={() => setIsPasswordModalOpen(true)}
            onSelectDocument={(doc) => setSelectedDocForDetail(doc)}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={(doc) => setDocToDelete(doc)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <p>Sistem Rekap & Dokumen &copy; 2026. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Password Default: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">admin</span> (Dapat diubah di menu Pengaturan Profil)
        </p>
      </footer>

      {/* Password Verification Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onSuccess={() => {
          setIsUnlocked(true);
          setIsPasswordModalOpen(false);
          showToast('Akses Rekapitulasi Dokumen Berhasil Dibuka!');
        }}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Upload Document Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveDocument={handleSaveNewDocument}
        categories={categories}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
        userProfile={userProfile}
        isDriveConnected={!!googleUser}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSaveCategories={handleSaveCategories}
        documents={documents}
      />

      {/* Profile & Security Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Document Detail Preview Modal */}
      <DocumentDetailModal
        document={selectedDocForDetail}
        onClose={() => setSelectedDocForDetail(null)}
        onDownload={handleDownloadDocument}
        onDelete={(doc) => setDocToDelete(doc)}
        categories={categories}
      />

      {/* Delete Password Verification Modal */}
      <DeletePasswordModal
        isOpen={!!docToDelete}
        document={docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirmDelete={(docId) => {
          handleDeleteDocument(docId);
          setDocToDelete(null);
        }}
      />

      {/* Google Drive Import Picker Modal */}
      <GoogleDrivePickerModal
        isOpen={isDrivePickerOpen}
        onClose={() => setIsDrivePickerOpen(false)}
        isDriveConnected={!!googleUser}
        accessToken={driveAccessToken}
        onGoogleSignIn={handleGoogleSignIn}
        onImportDriveFile={(newDoc) => {
          handleSaveNewDocument(newDoc);
          showToast(`Dokumen Drive "${newDoc.title}" diimpor!`);
        }}
      />

    </div>
  );
}
