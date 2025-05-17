'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transcript } from '@/lib/types';
import { formatDate, downloadTranscript } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function TranscriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch(`/api/storage/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Transcript not found",
              description: "The requested transcript could not be found.",
              variant: "destructive",
            });
            router.push('/storage');
            return;
          }
          throw new Error('Failed to fetch transcript');
        }
        
        const data = await response.json();
        setTranscript(data.transcript);
      } catch (error) {
        console.error('Error fetching transcript:', error);
        toast({
          title: "Failed to load transcript",
          description: "There was an error loading the transcript details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTranscript();
    }
  }, [params.id, router, toast]);

  const handleCopy = () => {
    if (!transcript) return;
    
    let copyText = '';
    
    transcript.content.shipper.forEach((line) => {
      copyText += `Shipper: ${line}\n`;
    });
    
    transcript.content.customer.forEach((line) => {
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
    
    downloadTranscript(transcript.content, `${transcript.title}.json`);
    toast({
      title: "Downloaded",
      description: "Transcript has been downloaded.",
      variant: "success",
    });
  };

  const handleBack = () => {
    router.push('/storage');
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Transcript not found</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Storage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button 
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to storage
      </button>
      
      <div className="border rounded-md p-6 bg-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{transcript.title}</h1>
            <p className="text-gray-500">{formatDate(transcript.dateCreated)} - {transcript.size}</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap">
            {`{`}
            {transcript.content.shipper.length > 0 && (
              <div className="ml-4 mt-2">
                <span className="text-red-500 font-medium">"Shipper"</span>: 
                {transcript.content.shipper.map((text, index) => (
                  <div key={index} className="ml-4">
                    "{text}"{index < transcript.content.shipper.length - 1 ? "," : ""}
                  </div>
                ))}
              </div>
            )}
            
            {transcript.content.customer.length > 0 && (
              <div className="ml-4 mt-2">
                <span className="text-blue-500 font-medium">"Khách hàng"</span>: 
                {transcript.content.customer.map((text, index) => (
                  <div key={index} className="ml-4">
                    "{text}"{index < transcript.content.customer.length - 1 ? "," : ""}
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