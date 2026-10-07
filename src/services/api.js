// PrintM Real API Service
// Connects frontend UI to Raspberry Pi backend

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('kiosk_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const Api = {
  // 1. Authentication Endpoints
  guestLogin: async () => {
    const res = await fetch(`${API_BASE}/api/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login as guest');
    return data;
  },

  sendOtp: async (email) => {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  },

  verifyOtp: async (email, otp) => {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid OTP');
    return data;
  },

  // 2. File Upload & Pricing
  uploadFile: async (fileObject) => {
    const formData = new FormData();
    formData.append('file', fileObject);

    const headers = getAuthHeaders();

    const res = await fetch(`${API_BASE}/api/files/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload PDF');
    return data;
  },

  getPricingRates: async () => {
    const res = await fetch(`${API_BASE}/api/pricing/rates`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch rates');
    return data;
  },

  // 3. Jobs & Orders
  createJob: async (orderData) => {
    const res = await fetch(`${API_BASE}/api/jobs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create job');
    return data;
  },

  getJobs: async () => {
    const token = localStorage.getItem('kiosk_token');
    if (!token) return [];

    const res = await fetch(`${API_BASE}/api/jobs`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
    return data;
  },

  getJobStatus: async (jobId) => {
    const res = await fetch(`${API_BASE}/api/jobs/${jobId}/status`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch status');
    return data;
  }
};

export default Api;
