import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CheckoutScreen from './components/CheckoutScreen';
import PrintCodeScreen from './components/PrintCodeScreen';
import { MockApi } from './services/mockApi';
import MyJobsScreen from './components/MyJobsScreen';
import InfoScreen from './components/InfoScreen';
import ProfileScreen from './components/ProfileScreen';

const DEFAULT_SETTINGS = {
  copies: 1,
  color: 'bw',
  orientation: 'portrait',
  duplex: false
};

function createFile(name, pages, size) {
  return { name, pages, size, ...DEFAULT_SETTINGS };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('splash'); // 'splash' | 'main' | 'checkout' | 'checkout-confirm' | 'print-code'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'my-jobs' | 'info' | 'profile'
  const [darkMode, setDarkMode] = useState(false);

  // Print Settings State — settings are now per-file (starts empty)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('kiosk'); // 'upi' | 'kiosk'

  // Generated Print Code
  const [generatedCode, setGeneratedCode] = useState("PM-7284");

  // Database of Print Jobs
  const [jobs, setJobs] = useState([]);

  // Poll for jobs every 3 seconds to simulate real-time updates
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await MockApi.getJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    
    // Initial fetch
    fetchJobs();
    
    // Set up polling
    const intervalId = setInterval(fetchJobs, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Dark Mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Action handlers ---

  const handleUploadFile = (newFile) => {
    const file = createFile(newFile.name, newFile.pages, newFile.size);
    setSelectedFiles(prev => [...prev, file]);
    setCurrentPage('checkout');
  };

  const handleSelectQuickTemplate = (name, pages) => {
    const file = createFile(name, pages, `${(pages * 0.15).toFixed(1)} MB`);
    setSelectedFiles([file]);
    setCurrentPage('checkout');
  };

  const handleDeleteFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddFileInCheckout = (newFile) => {
    const file = createFile(newFile.name, newFile.pages, newFile.size);
    setSelectedFiles(prev => [...prev, file]);
  };

  /** Update settings for a specific file by index */
  const handleUpdateFileSettings = (index, updates) => {
    setSelectedFiles(prev =>
      prev.map((f, i) => (i === index ? { ...f, ...updates } : f))
    );
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmCheckout = async () => {
    setIsProcessing(true);
    try {
      const data = await MockApi.createJob({ files: selectedFiles, paymentMethod });
      
      setGeneratedCode(data.qrData);

      const totalPages = selectedFiles.reduce((acc, f) => acc + (f.pages || 1), 0);
      const totalCopies = Math.max(...selectedFiles.map(f => f.copies));
      const newJob = {
        id: data.jobId,
        filename: selectedFiles.length > 1 ? `${selectedFiles.length} documents` : selectedFiles[0].name,
        pages: totalPages,
        copies: totalCopies,
        timestamp: new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        status: data.status,
        printCode: data.qrData
      };

      // We don't need to manually update state because the polling useEffect will pick it up
      // setJobs(prev => [newJob, ...prev]);

      setCurrentPage('print-code');
    } catch (err) {
      alert("Failed to create job: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintAgain = (completedJob) => {
    const file = createFile(completedJob.filename, completedJob.pages, '1.2 MB');
    file.copies = completedJob.copies;
    setSelectedFiles([file]);
    setCurrentPage('checkout');
  };

  const handleLogout = () => {
    localStorage.removeItem('kiosk_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setSelectedFiles([]);
    setPaymentMethod('kiosk');
    setActiveTab('home');
    setCurrentPage('splash');
  };

  const rawName = localStorage.getItem('user_name') || 'Student';
  const displayUserName = rawName === 'Guest User' ? 'Student' : rawName;

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden dark:bg-slate-900 text-on-surface dark:text-slate-200">
        
        {/* State rendering */}
        {currentPage === 'splash' && (
          <SplashScreen onFinish={() => {
            const token = localStorage.getItem('kiosk_token');
            if (token) {
              setCurrentPage('main');
            } else {
              setCurrentPage('login');
            }
          }} />
        )}

        {currentPage === 'login' && (
          <LoginScreen onLoginSuccess={() => setCurrentPage('main')} />
        )}

        {currentPage === 'main' && (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            {/* Render Tabs */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeTab === 'home' && (
                <HomeScreen 
                  onUploadFile={handleUploadFile}
                  onSelectQuickTemplate={handleSelectQuickTemplate}
                  activeJobsCount={jobs.filter(j => j.status === 'ready' || j.status === 'printing').length}
                  onNavigateTab={setActiveTab}
                  userName={displayUserName}
                />
              )}
              {activeTab === 'my-jobs' && (
                <MyJobsScreen 
                  jobs={jobs}
                  onViewQRCode={(code) => {
                    setGeneratedCode(code);
                    setCurrentPage('print-code');
                  }}
                  onPrintAgain={handlePrintAgain}
                  onNavigateTab={setActiveTab}
                />
              )}
              {activeTab === 'info' && (
                <InfoScreen onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'profile' && (
                <ProfileScreen 
                  onLogout={handleLogout}
                  darkMode={darkMode}
                  onToggleDarkMode={setDarkMode}
                  onNavigateTab={setActiveTab}
                  userName={localStorage.getItem('user_name') || "Durgesh Kumar"}
                  userEmail={localStorage.getItem('user_email') || "Durgesh@sharda.ac.in"}
                />
              )}
            </div>

            {/* Persistent Bottom NavBar */}
            <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg z-50 flex items-center justify-between p-1.5 overflow-hidden">
              
              {/* Home */}
              <button 
                onClick={() => setActiveTab('home')}
                className={`transition-all duration-300 ease-in-out ${
                  activeTab === 'home' 
                    ? 'h-full bg-primary text-on-primary px-5 rounded-full flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'h-full text-slate-400 dark:text-slate-500 hover:text-primary px-4 rounded-full flex items-center justify-center'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                {activeTab === 'home' && <span>Home</span>}
              </button>

              {/* My Jobs */}
              <button 
                onClick={() => setActiveTab('my-jobs')}
                className={`transition-all duration-300 ease-in-out ${
                  activeTab === 'my-jobs' 
                    ? 'h-full bg-primary text-on-primary px-5 rounded-full flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'h-full text-slate-400 dark:text-slate-500 hover:text-primary px-4 rounded-full flex items-center justify-center'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'my-jobs' ? "'FILL' 1" : "'FILL' 0" }}>description</span>
                {activeTab === 'my-jobs' && <span>My Jobs</span>}
              </button>

              {/* Info */}
              <button 
                onClick={() => setActiveTab('info')}
                className={`transition-all duration-300 ease-in-out ${
                  activeTab === 'info' 
                    ? 'h-full bg-primary text-on-primary px-5 rounded-full flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'h-full text-slate-400 dark:text-slate-500 hover:text-primary px-4 rounded-full flex items-center justify-center'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'info' ? "'FILL' 1" : "'FILL' 0" }}>info</span>
                {activeTab === 'info' && <span>Info</span>}
              </button>

              {/* Profile */}
              <button 
                onClick={() => setActiveTab('profile')}
                className={`transition-all duration-300 ease-in-out ${
                  activeTab === 'profile' 
                    ? 'h-full bg-primary text-on-primary px-5 rounded-full flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'h-full text-slate-400 dark:text-slate-500 hover:text-primary px-4 rounded-full flex items-center justify-center'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                {activeTab === 'profile' && <span>Profile</span>}
              </button>

            </nav>
          </div>
        )}

        {currentPage === 'checkout' && (
          <CheckoutScreen 
            selectedFiles={selectedFiles}
            isProcessing={isProcessing}
            onDeleteFile={handleDeleteFile}
            onAddFile={handleAddFileInCheckout}
            onUpdateFileSettings={handleUpdateFileSettings}
            onBack={() => {
              setSelectedFiles([]);
              setCurrentPage('main');
              setActiveTab('home');
            }}
            onProceed={handleConfirmCheckout}
            onNavigateTab={(tab) => {
              setCurrentPage('main');
              setActiveTab(tab);
            }}
          />
        )}

        {currentPage === 'print-code' && (
          <PrintCodeScreen 
            printCode={generatedCode}
            onClose={() => {
              setCurrentPage('main');
              setActiveTab('my-jobs');
            }}
            onNavigateTab={(tab) => {
              setCurrentPage('main');
              setActiveTab(tab);
            }}
          />
        )}

      </div>
    </MobileFrame>
  );
}
