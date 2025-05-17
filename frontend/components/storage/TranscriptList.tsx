'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { TranscriptPreview } from '@/lib/types';

interface TranscriptListProps {
  transcripts: TranscriptPreview[];
}

export default function TranscriptList({ transcripts }: TranscriptListProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredTranscripts = transcripts.filter(transcript => 
    transcript.title.toLowerCase().includes(search.toLowerCase()) || 
    (transcript.preview && transcript.preview.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRowClick = (id: string) => {
    router.push(`/storage/${id}`);
  };

  return (
    <div className="border rounded-md bg-white overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">My storage</h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transcripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 py-2 pr-3 border rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <Button variant="outline">Select</Button>
          <Button>Upload files</Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date uploaded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTranscripts.length > 0 ? (
              filteredTranscripts.map((transcript) => (
                <tr 
                  key={transcript.id} 
                  onClick={() => handleRowClick(transcript.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transcript.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transcript.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(transcript.dateCreated)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No transcripts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}