const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getUserStats(jwt) {
  const response = await fetch(`${API_BASE_URL}/stats/me`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
}
