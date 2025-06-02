
import { File, Image, FileText, Archive } from 'lucide-react';

export const validateFile = (file: File) => {
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/zip'];
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file melebihi 50MB. Silakan pilih file yang lebih kecil.'
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipe file tidak didukung. Gunakan format JPG, PNG, PDF, atau ZIP.'
    };
  }
  
  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Hari ini';
  } else if (diffDays === 2) {
    return 'Kemarin';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} hari lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
};

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return Image;
  } else if (fileType === 'application/pdf') {
    return FileText;
  } else if (fileType === 'application/zip') {
    return Archive;
  } else {
    return File;
  }
};
