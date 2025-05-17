'use client';

import React, { useRef, useEffect } from 'react';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadTranscript } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TranscriptDisplayProps {
  transcript: {
    shipper: string[];
    customer: string[];
  } | null;
  isLoading?: boolean;
}

export default function TranscriptDisplay({ transcript, isLoading = false }: TranscriptDisplayProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !isLoading) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, isLoading]);

  const handleCopy = () => {
    if (!transcript) return;
    
    let copyText = '';
    
    transcript.shipper.forEach((line) => {
      copyText += `Shipper: ${line}\n`;
    });
    
    transcript.customer.forEach((line) => {
      copyText += `Customer: ${line}\n`;
    });
    
    navigator.clipboard.writeText(copyText);
    toast({
      title: "Copied to clipboard",
      description: "Transcript has been copied to clipboard.",
      variant: "success",
    });
  };

  const handleDownload = () => {
    if (!transcript) return;
    
    downloadTranscript(transcript, `transcript-${Date.now()}.json`);
    toast({
      title: "Downloaded",
      description: "Transcript has been downloaded.",
      variant: "success",
    });
  };

  if (isLoading) {
    return (
      <div className="border rounded-md p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transcript Output</h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="border rounded-md p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transcript Output</h2>
        </div>
        <div className="text-center text-gray-500 p-8">
          Record audio or upload a file to see the transcript
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transcript Audio</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="max-h-96 overflow-y-auto border rounded-md p-4 bg-gray-50"
      >
        <div className="space-y-6">
          <pre className="whitespace-pre-wrap">
            {`{`}
            {transcript.shipper.length > 0 && (
              <div className="ml-4 mt-2">
                <span className="text-red-500 font-medium">"Shipper"</span>: 
                {transcript.shipper.map((text, index) => (
                  <div key={index} className="ml-4">
                    "{text}"{index < transcript.shipper.length - 1 ? "," : ""}
                  </div>
                ))}
              </div>
            )}
            
            {transcript.customer.length > 0 && (
              <div className="ml-4 mt-2">
                <span className="text-blue-500 font-medium">"Khách hàng"</span>: 
                {transcript.customer.map((text, index) => (
                  <div key={index} className="ml-4">
                    "{text}"{index < transcript.customer.length - 1 ? "," : ""}
                  </div>
                ))}
              </div>
            )}
            {`}`}
          </pre>
        </div>
      </div>
    </div>
  );
}