
import React, { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { Upload, Files } from 'lucide-react';

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'files'>('upload');

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
        ...file,
        uploadDate: new Date(file.uploadDate)
      }));
      setFiles(parsedFiles);
    }
  }, []);

  // Save files to localStorage whenever files state changes
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (newFile: FileData) => {
    setFiles(prev => [newFile, ...prev]);
    setActiveTab('files');
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Files className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  File Share Hub
                </h1>
                <p className="text-gray-600 text-sm">Upload dan bagikan file dengan mudah</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'files'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Files className="w-4 h-4 inline mr-2" />
                Files ({files.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'upload' ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload File Anda
              </h2>
              <p className="text-gray-600">
                Pilih file untuk diunggah. Maksimal 50MB dengan format .jpg, .png, .pdf, atau .zip
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                File Dashboard
              </h2>
              <p className="text-gray-600">
                Semua file yang telah diunggah dapat diunduh oleh siapa saja
              </p>
            </div>
            <FileList files={files} onFileDelete={handleFileDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
