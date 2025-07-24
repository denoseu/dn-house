const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchPhotos() {
  const res = await fetch(`${BACKEND_URL}/api/photos`);
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}

export async function uploadPhoto({ file, caption, type }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('caption', caption);
  formData.append('type', type || "postcard"); // default ke postcard jika kosong

  const res = await fetch(`${BACKEND_URL}/api/photos/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload photo');
  return res.json();
}
