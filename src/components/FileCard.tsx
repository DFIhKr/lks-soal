
import React, { useState } from 'react';
import { FileData } from '@/pages/Index';
import { Download, File, X, Image, FileText, Archive } from 'lucide-react';
import { formatFileSize, formatDate, getFileIcon } from '@/utils/fileUtils';

interface FileCardProps {
  file: FileData;
  onDelete: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  const FileIcon = getFileIcon(file.type);

  return (
    <div className={`
      bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105
      ${isDeleting ? 'opacity-50 scale-95' : ''}
    `}>
      {/* File Preview/Icon */}
      <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative group">
        {file.type.startsWith('image/') ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <FileIcon className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
            </p>
          </div>
        )}
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* File Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 truncate" title={file.name}>
            {file.name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDate(file.uploadDate)}</span>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span className="font-medium">Download</span>
        </button>
      </div>
    </div>
  );
};
