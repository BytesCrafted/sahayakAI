// src/lib/upload.ts

const API_BASE_URL = 'http://146.148.56.108:8000';

export async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload_file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('File upload failed:', errorBody);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
