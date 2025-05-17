import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number | null | undefined): string {
	if (!date) return 'Invalid date';

	const parsedDate = new Date(date);
	if (isNaN(parsedDate.getTime())) return 'Invalid date';

	return new Intl.DateTimeFormat('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(parsedDate);
}


export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}

export function downloadTranscript(content: any, filename: string): void {
	const element = document.createElement('a');
	const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
	element.href = URL.createObjectURL(file);
	element.download = filename;
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}