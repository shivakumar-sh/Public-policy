import React, { useState, useCallback } from 'react';
import { HiCloudUpload, HiDocumentText, HiCheckCircle, HiX } from 'react-icons/hi';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const PDFUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      if (selected.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB');
        return;
      }
      setFile(selected);
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      toast.success('File processed successfully!');
      if (onUploadSuccess) onUploadSuccess(response.data);
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="card border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
      {!file ? (
        <label className="flex flex-col items-center justify-center cursor-pointer py-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110">
            <HiCloudUpload size={32} />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-white">Upload Policy PDF</span>
          <span className="text-xs text-slate-400 mt-1">Maximum size 10MB</span>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="py-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <HiDocumentText className="text-primary" size={32} />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{file.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {!isUploading && (
              <button onClick={() => setFile(null)} className="text-slate-300 hover:text-danger">
                <HiX size={20} />
              </button>
            )}
          </div>

          {isUploading ? (
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-primary mb-2 uppercase tracking-widest">
                <span>Analyzing Document...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button 
              onClick={uploadFile}
              className="btn-primary w-full mt-6"
            >
              Process with AI
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
