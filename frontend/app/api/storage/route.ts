import { NextResponse } from 'next/server';
import { getTranscripts, saveTranscript } from '@/lib/mock-data';

export async function GET() {
  try {
    const transcripts = getTranscripts();
    return NextResponse.json({ transcripts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcripts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate request data
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const transcript = saveTranscript({
      title: data.title,
      content: data.content,
      size: data.size || '0MB',
      notes: data.notes
    });
    
    return NextResponse.json({ transcript }, { status: 201 });
  } catch (error) {
    console.error('Error saving transcript:', error);
    return NextResponse.json(
      { error: 'Failed to save transcript' },
      { status: 500 }
    );
  }
}