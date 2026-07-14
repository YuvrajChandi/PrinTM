// A mock API service to simulate backend responses during frontend development
// This avoids needing a real backend running to build the UI flows.

// Helper to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockApi = {
  // 1. Authentication Endpoints
  
  guestLogin: async () => {
    await delay(600); // Simulate network
    return {
      token: 'mock_jwt_guest_' + Date.now(),
      user: { id: 'guest_' + Math.floor(Math.random() * 10000), role: 'guest' }
    };
  },

  sendOtp: async (email) => {
    await delay(1000);
    // In real life, this sends an email. We just return success.
    if (!email || !email.includes('@')) {
      throw new Error("Invalid email address");
    }
    return { success: true, message: 'OTP sent to ' + email };
  },

  verifyOtp: async (email, otp) => {
    await delay(800);
    if (otp !== '123456') { // Hardcoded for testing
      throw new Error("Invalid OTP. Try 123456.");
    }
    return {
      token: 'mock_jwt_user_' + Date.now(),
      user: { id: 'student_1', email }
    };
  },

  // 2. File Upload & Pricing Endpoints

  uploadFile: async (fileObject) => {
    // We expect a File object here from an <input type="file" />
    // To simulate progress, this could theoretically be more complex, 
    // but we'll return a simple resolved promise after a delay.
    await delay(2000); 
    
    // Generate a random page count between 1 and 20 for testing
    const fakePageCount = Math.floor(Math.random() * 20) + 1;
    
    return {
      fileId: 'file_' + Math.random().toString(36).substring(2, 9),
      fileName: fileObject.name || 'document.pdf',
      pageCount: fakePageCount
    };
  },

  getPricingRates: async () => {
    await delay(300);
    return {
      bw_single: 0.10,
      bw_double: 0.15,
      color_single: 0.50,
      color_double: 0.80,
    };
  },

  // 3. Jobs & Orders

  createJob: async (orderData) => {
    await delay(1200);
    // orderData would contain { files: [...], paymentMethod: 'pay_at_kiosk' }
    const jobId = 'JOB-' + Math.floor(1000 + Math.random() * 9000);
    
    // Save to localStorage so we can simulate state across app reloads if needed
    const existingJobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
    const newJob = {
      jobId,
      status: 'ready',
      createdAt: new Date().toISOString(),
      orderData
    };
    localStorage.setItem('mockJobs', JSON.stringify([newJob, ...existingJobs]));

    return {
      jobId,
      qrData: jobId, // As requested, just generating the string
      status: 'ready'
    };
  },

  getJobs: async () => {
    await delay(300);
    const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
    
    // Simulate progression: any pending job older than 15s becomes completed
    let changed = false;
    const updatedJobs = jobs.map(job => {
      if (job.status === 'ready' || job.status === 'pending') {
        const ageInSeconds = (Date.now() - new Date(job.createdAt).getTime()) / 1000;
        if (ageInSeconds > 60) {
          changed = true;
          return { ...job, status: 'completed' };
        }
      }
      return job;
    });

    if (changed) {
      localStorage.setItem('mockJobs', JSON.stringify(updatedJobs));
    }

    return updatedJobs;
  },

  getJobStatus: async (jobId) => {
    // This endpoint is polled by the frontend.
    // For our mock, we'll just check localStorage.
    // We could add a dev-helper to simulate it changing state.
    await delay(300);
    const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
    const job = jobs.find(j => j.jobId === jobId);
    
    if (!job) throw new Error("Job not found");
    return { status: job.status };
  }
};
