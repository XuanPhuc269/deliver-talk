'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg'];
    const maxSize = 200 * 1024 * 1024; // 200MB
    
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a WAV or MP3 file."
      });
      return;
    }
    
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size should not exceed 200MB."
      });
      return;
    }
    
    setFile(file);
    onFileSelect(file);
    toast({
      title: "File uploaded",
      description: `${file.name} has been added.`,
      variant: "success",
    });
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".wav,.mp3"
        className="hidden"
      />
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-colors ${
            isDragging ? 'border-gray-500 bg-gray-100' : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-lg font-medium mb-1">Drag and drop file here</p>
          <p className="text-sm text-gray-500 mb-4">Limit 200MB per file. WAV or .mp3</p>
          <Button onClick={openFileSelector} variant="outline">
            Browse files
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}