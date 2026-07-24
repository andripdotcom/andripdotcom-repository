import React from 'react';
import { 
  FileText, 
  Lock, 
  Unlock, 
  Upload, 
  Settings, 
  FolderPlus, 
  Cloud, 
  CloudOff, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  isUnlocked: boolean;
  onLockToggle: () => void;
  onOpenUpload: () => void;
  onOpenCategories: () => void;
  onOpenProfile: () => void;
  onOpenDrivePicker: () => void;
  userProfile: UserProfile;
  isDriveConnected: boolean;
  driveUserEmail?: string;
  onGoogleSignIn: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isUnlocked,
  onLockToggle,
  onOpenUpload,
  onOpenCategories,
  onOpenProfile,
  onOpenDrivePicker,
  userProfile,
  isDriveConnected,
  driveUserEmail,
  onGoogleSignIn,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
                  Sistem Rekap & Dokumen
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Pengelolaan & Rekapitulasi Berkas Aman Berbasis Cloud
              </p>
            </div>
          </div>

          {/* Quick Actions & Security Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Google Drive Status Button */}
            {isDriveConnected ? (
              <button
                onClick={onOpenDrivePicker}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                title={`Terhubung ke Google Drive (${driveUserEmail || 'Aktif'})`}
              >
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span className="truncate max-w-[120px]">Drive Terhubung</span>
              </button>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                title="Hubungkan akun Google Drive untuk sync & impor file"
              >
                <CloudOff className="w-4 h-4 text-slate-400" />
                <span>Hubungkan Drive</span>
              </button>
            )}

            {/* Lock Security Toggle */}
            <button
              onClick={onLockToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isUnlocked
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
              title={isUnlocked ? 'Klik untuk Mengunci Rekap Dokumen' : 'Rekap Terkunci - Buka dengan Password'}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Akses Rekap:</span>
                  <span className="font-semibold text-amber-300">Terbuka</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Akses Rekap:</span>
                  <span className="font-semibold text-rose-300">Terkunci</span>
                </>
              )}
            </button>

            {/* Category Manager Trigger */}
            <button
              onClick={onOpenCategories}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
              title="Kelola Kategori Dokumen"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {/* Upload Document Primary CTA */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Unggah Berkas</span>
            </button>

            {/* Profile & Security Settings Trigger */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
              title="Pengaturan Profil & Password Security"
            >
              {userProfile.avatarUrl ? (
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.name} 
                  className="w-5 h-5 rounded-full object-cover border border-slate-600" 
                />
              ) : (
                <UserCheck className="w-4 h-4 text-blue-400" />
              )}
              <span className="hidden lg:inline truncate max-w-[100px]">{userProfile.name}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
