
import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { FileData } from '@/pages/Index';
import { validateFile, formatFileSize } from '@/utils/fileUtils';

interface FileUploadProps {
  onFileUpload: (file: FileData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setSuccess(false);

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const fileData: FileData = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          url: reader.result as string
        };

        setTimeout(() => {
          onFileUpload(fileData);
          setIsUploading(false);
          setSuccess(true);
          setUploadProgress(0);
          
          // Reset form
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          setTimeout(() => setSuccess(false), 3000);
        }, 500);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Gagal mengunggah file. Silakan coba lagi.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept=".jpg,.jpeg,.png,.pdf,.zip"
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full transition-all ${
            isDragging ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragging ? 'Lepaskan file di sini' : 'Klik atau seret file ke sini'}
            </h3>
            <p className="text-gray-500 text-sm">
              Format yang didukung: JPG, PNG, PDF, ZIP
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Maksimal 50MB
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Mengunggah file...</p>
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700 font-medium">File berhasil diunggah!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File Requirements */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Persyaratan File:</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Format: JPG, PNG, PDF, ZIP</li>
          <li>• Ukuran maksimal: 50MB</li>
          <li>• File akan tersedia untuk diunduh oleh siapa saja</li>
        </ul>
      </div>
    </div>
  );
};
