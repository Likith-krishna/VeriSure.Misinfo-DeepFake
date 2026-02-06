import React, { useCallback } from 'react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  error?: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, error }) => {
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-6">
      <div 
        className="relative group cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
        <div className="relative bg-slate-900 rounded-xl border border-slate-700 p-12 flex flex-col items-center justify-center text-center hover:bg-slate-800/80 transition-all duration-300">
          <div className="bg-slate-800 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-10 h-10 text-cyan-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Initialize Forensic Analysis</h3>
          <p className="text-slate-400 max-w-md mb-8">
            Drag and drop high-resolution imagery here, or click to browse.
            Supports JPEG, PNG, WEBP (Max 25MB).
          </p>
          
          <label className="relative px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors cursor-pointer overflow-hidden">
            <span className="relative z-10 flex items-center">
              <FileImage className="w-4 h-4 mr-2" />
              Select Evidence File
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center justify-center space-x-2 p-2 bg-slate-900/50 rounded border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>FaceForensics++ Core</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-2 bg-slate-900/50 rounded border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Frequency Domain Analysis</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-2 bg-slate-900/50 rounded border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>Vision Transformer</span>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;