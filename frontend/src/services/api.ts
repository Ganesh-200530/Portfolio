const API_BASE_URL = (() => {
  let url = import.meta.env.VITE_API_URL;
  if (!url) return 'http://127.0.0.1:8000/api';
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (!url.endsWith('/api')) url += '/api';
  return url;
})();

export const api = {
  getEducation: async () => {
    const response = await fetch(`${API_BASE_URL}/education`);
    if (!response.ok) throw new Error('Failed to fetch education');
    return response.json();
  },

  getSkills: async () => {
    const response = await fetch(`${API_BASE_URL}/skills`);
    if (!response.ok) throw new Error('Failed to fetch skills');
    return response.json();
  },

  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  getCertifications: async () => {
    const response = await fetch(`${API_BASE_URL}/certifications`);
    if (!response.ok) throw new Error('Failed to fetch certifications');
    return response.json();
  },

  getSocial: async () => {
    const response = await fetch(`${API_BASE_URL}/social`);
    if (!response.ok) throw new Error('Failed to fetch social links');
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  sendMessage: async (data: Record<string, any>) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to send message');
    return result;
  }
};
