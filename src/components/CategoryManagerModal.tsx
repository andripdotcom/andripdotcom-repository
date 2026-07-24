import React, { useState } from 'react';
import { X, FolderPlus, Plus, Trash2, Edit2, Check, Folder } from 'lucide-react';
import { CategoryInfo, DocumentCategory, DocumentItem } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  onSaveCategories: (updated: CategoryInfo[]) => void;
  documents: DocumentItem[];
}

const COLOR_PRESETS = [
  { name: 'Biru', value: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200' },
  { name: 'Hijau', value: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200' },
  { name: 'Kuning', value: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200' },
  { name: 'Ungu', value: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200' },
  { name: 'Merah', value: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200' },
  { name: 'Nila', value: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200' },
  { name: 'Abu-abu', value: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200' },
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategories,
  documents,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLOR_PRESETS[0].value);
  const [newCatDesc, setNewCatDesc] = useState('');

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const exists = categories.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase());
    if (exists) {
      alert('Kategori dengan nama ini sudah ada!');
      return;
    }

    const newCat: CategoryInfo = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      color: newCatColor,
      iconName: 'Folder',
      description: newCatDesc.trim() || 'Kategori kustom pengguna',
    };

    onSaveCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (catId: string, catName: DocumentCategory) => {
    const inUse = documents.some((d) => d.category === catName);
    if (inUse) {
      alert(`Kategori "${catName}" masih digunakan oleh dokumen yang ada. Pindahkan berkas terlebih dahulu.`);
      return;
    }
    if (confirm(`Hapus kategori "${catName}"?`)) {
      onSaveCategories(categories.filter((c) => c.id !== catId));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Kelola Kategori Dokumen
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tambah atau sesuaikan kategori pengelompokan arsip dokumen.
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

        {/* Form Add New Category */}
        <form onSubmit={handleAddCategory} className="my-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-500" />
            <span>Tambah Kategori Baru</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Contoh: Berkas Proyek A"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Warna Label Badge
              </label>
              <select
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                {COLOR_PRESETS.map((cp) => (
                  <option key={cp.name} value={cp.value}>
                    {cp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Deskripsi Singkat
            </label>
            <input
              type="text"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Keterangan singkat pengelompokan..."
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Kategori Baru</span>
          </button>
        </form>

        {/* Existing Categories List */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Daftar Kategori Terdaftar ({categories.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const docCount = documents.filter((d) => d.category === cat.name).length;
              return (
                <div
                  key={cat.id}
                  className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cat.color}`}>
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {docCount} berkas
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
