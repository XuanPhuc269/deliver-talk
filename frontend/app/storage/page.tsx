'use client';

import React, { useEffect, useState } from 'react';
import { Package as PackageBox } from 'lucide-react';
import TranscriptList from '@/components/storage/TranscriptList';
import { TranscriptPreview } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function StoragePage() {
  const [transcripts, setTranscripts] = useState<TranscriptPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const response = await fetch('/api/storage');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transcripts');
        }
        
        const data = await response.json();
        setTranscripts(data.transcripts);
      } catch (error) {
        console.error('Error fetching transcripts:', error);
        toast({
          title: "Failed to load transcripts",
          description: "There was an error loading your saved transcripts.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscripts();
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <PackageBox className="h-8 w-8 mr-2" />
        <h1 className="text-3xl font-bold">DeliverTalk</h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <TranscriptList transcripts={transcripts} />
      )}
    </div>
  );
}