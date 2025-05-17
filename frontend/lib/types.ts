export interface Transcript {
  id: string;
  title: string;
  dateCreated: Date;
  content: {
    shipper: string[];
    customer: string[];
  };
  size: string;
  notes?: string;
}

export type TranscriptPreview = {
  id: string;
  title: string;
  dateCreated: Date;
  size: string;
  preview?: string;
};