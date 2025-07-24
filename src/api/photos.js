const BACKEND_URL = "https://dn-house-backend.vercel.app";

export async function fetchPhotos() {
  const res = await fetch(`${BACKEND_URL}/api/photos`);
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}

export async function fetchPhotoById(id) {
  const res = await fetch(`${BACKEND_URL}/api/photos/${id}`);
  if (!res.ok) throw new Error('Failed to fetch photo');
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

export async function updatePhoto(id, { file, caption, type }) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('caption', caption || '');
  formData.append('type', type || 'postcard');
  const res = await fetch(`${BACKEND_URL}/api/photos/update/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update photo');
  return res.json();
}

export async function deletePhoto(id) {
  const res = await fetch(`${BACKEND_URL}/api/photos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete photo');
  return res.json();
}

export async function refreshPhotoUrl(id) {
  const res = await fetch(`${BACKEND_URL}/api/photos/${id}/refresh-url`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to refresh photo URL');
  return res.json();
}