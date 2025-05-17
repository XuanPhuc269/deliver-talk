'use client';

import React, { useState } from 'react';
import { Package as PackageBox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/transcribe/FileUploader';
import AudioRecorder from '@/components/transcribe/AudioRecorder';
import TranscriptDisplay from '@/components/transcribe/TranscriptDisplay';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<{shipper: string[], customer: string[]} | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
    setSelectedFile(file);
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file or record audio first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTranscribing(true);
      
      // In a real application, you would upload the file to the server
      // For this MVP, we'll just simulate the API call
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: selectedFile.name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const data = await response.json();
      setTranscript(data);

      // Save to storage
      await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedFile.name,
          content: data,
          size: `${Math.round(selectedFile.size / 1024 / 1024)}MB`,
        }),
      });

      toast({
        title: "Transcription complete",
        description: "Your audio has been transcribed and saved.",
        variant: "success",
      });
    } catch (error) {
      console.error('Error transcribing:', error);
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your audio.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <PackageBox className="h-8 w-8 mr-2" />
        <h1 className="text-3xl font-bold">DeliverTalk</h1>
      </div>
      
      <div className="space-y-6">
        <FileUploader onFileSelect={handleFileSelect} />
        
        <div className="flex justify-center">
          <div className="text-sm text-gray-500">or</div>
        </div>
        
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleTranscribe}
            disabled={!selectedFile || isTranscribing}
            className="px-8"
          >
            Transcribe
            {isTranscribing && (
              <span className="ml-2">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              </span>
            )}
          </Button>
        </div>
        
        <TranscriptDisplay 
          transcript={transcript} 
          isLoading={isTranscribing} 
        />
      </div>
    </div>
  );
}