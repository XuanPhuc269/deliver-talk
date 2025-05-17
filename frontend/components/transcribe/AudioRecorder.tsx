'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Your microphone is now active.",
        variant: "success",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsRecording(false);
      toast({
        title: "Recording completed",
        description: `Recording saved (${formatTime(recordingTime)})`,
        variant: "success",
      });
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="mb-4 flex items-center">
        {isRecording && (
          <div className="flex items-center mr-4">
            <Clock className="w-5 h-5 mr-1 text-red-500 animate-pulse" />
            <span className="text-red-500 font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        {isRecording ? (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Recording
          </Button>
        ) : (
          <Button 
            onClick={startRecording} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-red-100 rounded-full animate-ping opacity-75"></div>
            <Mic className="relative w-6 h-6 text-red-500" />
          </div>
        </div>
      )}
    </div>
  );
}