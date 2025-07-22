export async function fetchPhotos() {
  const res = await fetch('http://localhost:5000/api/photos');
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}
