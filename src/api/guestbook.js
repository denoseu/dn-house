const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchGuestbook() {
  const res = await fetch(`${BACKEND_URL}/api/guestbook`);
  if (!res.ok) throw new Error('Failed to fetch guestbook entries');
  return res.json();
}

export async function fetchGuestbookById(id) {
  const res = await fetch(`${BACKEND_URL}/api/guestbook/${id}`);
  if (!res.ok) throw new Error('Failed to fetch guestbook entry');
  return res.json();
}

export async function createGuestbookEntry({ from, subject, message }) {
  const res = await fetch(`${BACKEND_URL}/api/guestbook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, subject, message }),
  });
  if (!res.ok) throw new Error('Failed to create guestbook entry');
  return res.json();
}

export async function updateGuestbookEntry(id, { from, subject, message }) {
  const res = await fetch(`${BACKEND_URL}/api/guestbook/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, subject, message }),
  });
  if (!res.ok) throw new Error('Failed to update guestbook entry');
  return res.json();
}

export async function deleteGuestbookEntry(id) {
  const res = await fetch(`${BACKEND_URL}/api/guestbook/${id}`, {
     method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete guestbook entry');
  return res.json();
}

