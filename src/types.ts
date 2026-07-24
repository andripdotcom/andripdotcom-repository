export type DocumentCategory = 
  | 'Surat Masuk'
  | 'Surat Keluar'
  | 'Memo'
  | 'Kontrak & Perjanjian'
  | 'Kepegawaian'
  | 'SOP & Regulasi'
  | 'Lainnya'
  | string;

export interface CategoryInfo {
  id: string;
  name: DocumentCategory;
  color: string;
  iconName: string;
  description?: string;
}

export type FileType = 'pdf' | 'doc' | 'xls' | 'ppt' | 'image' | 'archive' | 'text' | 'other';

export interface DocumentItem {
  id: string;
  title: string;
  docNumber?: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: FileType;
  mimeType: string;
  category: DocumentCategory;
  description: string;
  uploader: string;
  uploadDate: string; // ISO date string or YYYY-MM-DD
  tags: string[];
  downloadUrl: string; // Base64 data URL or external URL
  googleDriveId?: string;
  googleDriveWebViewLink?: string;
  status: 'Aktif' | 'Arsip' | 'Rahasia' | 'Draft';
  isSyncedToDrive?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  avatarUrl?: string;
}

export interface DocumentFilter {
  query: string;
  category: string;
  fileType: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'date-desc' | 'date-asc' | 'title-asc' | 'size-desc';
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
}
