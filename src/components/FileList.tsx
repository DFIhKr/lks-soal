
import React, { useState } from 'react';
import { FileCard } from '@/components/FileCard';
import { FileData } from '@/pages/Index';
import { Search, Filter, Files } from 'lucide-react';

interface FileListProps {
  files: FileData[];
  onFileDelete: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onFileDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter files based on search term and type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type.includes(filterType);
    return matchesSearch && matchesType;
  });

  // Get unique file types for filter dropdown
  const fileTypes = ['all', ...new Set(files.map(file => {
    if (file.type.includes('image')) return 'image';
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('zip')) return 'zip';
    return 'other';
  }))];

  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Files className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada File
        </h3>
        <p className="text-gray-500 mb-6">
          Belum ada file yang diunggah. Mulai dengan mengunggah file pertama Anda!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">Semua Tipe</option>
            <option value="image">Gambar</option>
            <option value="pdf">PDF</option>
            <option value="zip">ZIP</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Menampilkan {filteredFiles.length} dari {files.length} file
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Hapus filter
          </button>
        )}
      </div>

      {/* File Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={() => onFileDelete(file.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak Ada File yang Ditemukan
          </h3>
          <p className="text-gray-500">
            Coba ubah kata kunci pencarian atau filter tipe file
          </p>
        </div>
      )}
    </div>
  );
};
