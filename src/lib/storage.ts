import { DocumentItem, CategoryInfo, DocumentCategory, UserProfile } from '../types';

export const DEFAULT_PASSWORD = 'admin';

const STORAGE_KEYS = {
  PASSWORD: 'doc_rekap_password_v1',
  DOCUMENTS: 'doc_rekap_items_v2',
  CATEGORIES: 'doc_rekap_categories_v2',
  USER_PROFILE: 'doc_rekap_profile_v1',
};

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  { id: 'cat-1', name: 'Surat Masuk', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200', iconName: 'Inbox', description: 'Surat dan dokumen resmi yang diterima dari pihak luar' },
  { id: 'cat-2', name: 'Surat Keluar', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200', iconName: 'Send', description: 'Surat dan dokumen resmi yang dikeluarkan organisasi' },
  { id: 'cat-3', name: 'Memo', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200', iconName: 'FileText', description: 'Memo internal, nota dinas, serta instruksi singkat pimpinan' },
  { id: 'cat-4', name: 'Kontrak & Perjanjian', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200', iconName: 'FileSignature', description: 'MOU, surat perjanjian kerja sama, dan dokumen legal' },
  { id: 'cat-5', name: 'Kepegawaian', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200', iconName: 'Users', description: 'SK Pengangkatan, berkas SDM, data presensi, dan sertifikat' },
  { id: 'cat-6', name: 'SOP & Regulasi', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200', iconName: 'BookOpen', description: 'Standard Operating Procedure, petunjuk teknis, dan aturan resmi' },
  { id: 'cat-7', name: 'Lainnya', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200', iconName: 'Folder', description: 'Dokumen umum dan arsip pendukung lainnya' },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Admin Arsip & Dokumen',
  email: 'sdm.umum.jabar3@gmail.com',
  role: 'Administrator Sistem',
  department: 'Bagian SDM & Umum',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

// Password Helper functions
export function getStoredPassword(): string {
  try {
    const pwd = localStorage.getItem(STORAGE_KEYS.PASSWORD);
    return pwd || DEFAULT_PASSWORD;
  } catch (e) {
    return DEFAULT_PASSWORD;
  }
}

export function updateStoredPassword(currentPwd: string, newPwd: string): { success: boolean; message: string } {
  const existing = getStoredPassword();
  if (currentPwd !== existing) {
    return { success: false, message: 'Password saat ini tidak cocok!' };
  }
  if (!newPwd || newPwd.trim().length < 3) {
    return { success: false, message: 'Password baru minimal 3 karakter.' };
  }
  try {
    localStorage.setItem(STORAGE_KEYS.PASSWORD, newPwd.trim());
    return { success: true, message: 'Password berhasil diperbarui!' };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan password ke penyimpanan lokal.' };
  }
}

export function verifyPassword(input: string): boolean {
  const current = getStoredPassword();
  return input.trim() === current;
}

// Category Storage functions
export function getStoredCategories(): CategoryInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES) || localStorage.getItem('doc_rekap_categories_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.map((cat: CategoryInfo) => {
          if (cat.name === ('Laporan Keuangan' as string)) {
            return {
              ...cat,
              name: 'Memo',
              description: 'Memo internal, nota dinas, serta instruksi singkat pimpinan',
              iconName: 'FileText'
            };
          }
          return cat;
        });
        saveCategories(cleaned);
        return cleaned;
      }
    }
  } catch (e) {
    console.warn('Error loading categories:', e);
  }
  saveCategories(INITIAL_CATEGORIES);
  return INITIAL_CATEGORIES;
}

export function saveCategories(categories: CategoryInfo[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
}

// Document Storage functions
export function getStoredDocuments(): DocumentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error loading documents:', e);
  }
  saveDocuments([]);
  return [];
}

export function saveDocuments(docs: DocumentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents:', e);
  }
}

// User Profile Storage
export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
    }
  } catch (e) {
    console.warn('Error loading profile:', e);
  }
  return INITIAL_PROFILE;
}

export function saveStoredProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

// Formatters
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileTypeInfo(fileName: string, mimeType?: string): { fileType: DocumentItem['fileType']; label: string } {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext)) return { fileType: 'pdf', label: 'PDF Document' };
  if (['doc', 'docx'].includes(ext)) return { fileType: 'doc', label: 'Word Document' };
  if (['xls', 'xlsx', 'csv'].includes(ext)) return { fileType: 'xls', label: 'Spreadsheet Excel' };
  if (['ppt', 'pptx'].includes(ext)) return { fileType: 'ppt', label: 'Presentation PowerPoint' };
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return { fileType: 'image', label: 'Gambar / Visual' };
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return { fileType: 'archive', label: 'Arsip Terkompresi' };
  if (['txt', 'md', 'json', 'xml'].includes(ext)) return { fileType: 'text', label: 'Teks Catatan' };
  return { fileType: 'other', label: 'Berkas umum' };
}
