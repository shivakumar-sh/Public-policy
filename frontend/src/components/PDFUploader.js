// frontend/src/components/PDFUploader.js
// Purpose: Drag-and-drop document upload component with progress tracking and summarization trigger

import React, { useState, useRef } from 'react';
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineX } from 'react-icons/hi';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const PDFUploader = ({ onSummarized, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const uploadRes = await api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const docId = uploadRes.data?.data?.document?._id || uploadRes.data?.data?._id;
      if (!docId) throw new Error('Upload verification failed');

      setDocumentId(docId);
      toast.success('File uploaded. Summarizing...');

      const summarizeRes = await api.post(`/chat/documents/${docId}/summarize`, { language: 'en' });
      const summaryText = summarizeRes.data?.data?.summary;
      setSummary(summaryText);
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      if (onError) onError(msg);
      toast.error(msg);
    }
  };

  const clearFile = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setSummary(null);
    setDocumentId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (summary) {
    return (
      <div className="p-4 bg-success/10 border border-success/20 rounded-2xl animate-in fade-in duration-300 shadow-sm">
        <p className="text-xs font-bold text-success mb-2">✓ Document Summarized Successfully</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[70%]">{file?.name}</p>
          <button onClick={() => onSummarized(summary, documentId)} className="bg-success text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-success/90 transition-all shadow-sm">
            View Summary in Chat
          </button>
        </div>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 shadow-sm animate-in fade-in duration-300">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
          <span className="truncate max-w-[80%]">Uploading & Analyzing {file?.name}...</span>
          <span>{uploadProgress}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
        </div>
      </div>
    );
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm animate-in fade-in duration-300">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
          <HiOutlineDocumentText size={28} />
        </div>
        <div className="flex-1 truncate">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
          <p className="text-xs text-slate-400 font-medium">{formatFileSize(file.size)}</p>
        </div>
        <button onClick={handleUpload} className="bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
          Upload & Summarize
        </button>
        <button onClick={clearFile} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
          <HiOutlineX size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3
                  ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}`}
    >
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
        <HiOutlineCloudUpload size={32} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Drag & drop a policy PDF here or <span className="text-primary underline">browse</span></p>
        <p className="text-xs text-slate-400 mt-1 font-medium">Official Government PDF files only (Max 10MB)</p>
      </div>
      <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
    </div>
  );
};

export default PDFUploader;
