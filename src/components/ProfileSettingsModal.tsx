import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Save
} from 'lucide-react';
import { UserProfile } from '../types';
import { getStoredPassword, updateStoredPassword, DEFAULT_PASSWORD } from '../lib/storage';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'profile'>('password');

  // Password state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile state
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [department, setDepartment] = useState(userProfile.department);
  const [role, setRole] = useState(userProfile.role);
  const [profileSaved, setProfileSaved] = useState(false);

  if (!isOpen) return null;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdFeedback(null);

    if (newPwd !== confirmPwd) {
      setPwdFeedback({ type: 'error', message: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    if (newPwd.length < 3) {
      setPwdFeedback({ type: 'error', message: 'Password minimal 3 karakter.' });
      return;
    }

    const res = updateStoredPassword(currentPwd, newPwd);
    if (res.success) {
      setPwdFeedback({ type: 'success', message: 'Password berhasil diperbarui!' });
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } else {
      setPwdFeedback({ type: 'error', message: res.message });
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset password rekapitulasi ke password standar awal?')) {
      const current = getStoredPassword();
      updateStoredPassword(current, DEFAULT_PASSWORD);
      setPwdFeedback({ type: 'success', message: 'Password berhasil di-reset ke standar.' });
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      role: role.trim(),
    };
    onSaveProfile(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pengaturan Profil & Keamanan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola password rekap dokumen dan identitas pengunggah.
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

        {/* Tabs Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 my-4">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Ubah Password Rekap</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Informasi Pengguna</span>
          </button>
        </div>

        {/* Tab 1: Ubah Password */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Keamanan Akses Rekap
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Password digunakan untuk melindungi akses rekapitulasi data dokumen dan unduhan.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password Saat Ini <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="w-full px-3 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Password baru"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Konfirmasi Password Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Feedback Alert */}
            {pwdFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  pwdFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {pwdFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{pwdFeedback.message}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset ke "admin"</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Password Baru</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Informasi Profil Pengguna */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap / Jabatan Uploader
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Pengguna
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departemen / Bagian
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Peran Sistem
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {profileSaved && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profil pengguna berhasil diperbarui!</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
