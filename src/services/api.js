import axios from 'axios';

const API_BASE_URL = 'https://biz-sphere-b.vercel.app/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request to:', url);
  
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.json();
}