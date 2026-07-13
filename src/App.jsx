import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import CheckoutScreen from './components/CheckoutScreen';
import CheckoutConfirmScreen from './components/CheckoutConfirmScreen';
import PrintCodeScreen from './components/PrintCodeScreen';
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

  // Print Settings State — settings are now per-file
  const [selectedFiles, setSelectedFiles] = useState([
    createFile('Resume_Final.pdf', 2, '1.2 MB'),
    createFile('Project_Draft.pdf', 10, '4.8 MB')
  ]);
  const [paymentMethod, setPaymentMethod] = useState('kiosk'); // 'upi' | 'kiosk'

  // Generated Print Code
  const [generatedCode, setGeneratedCode] = useState("PM-7284");

  // Database of Print Jobs
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      filename: 'Semester_Project_Final.pdf', 
      pages: 15, 
      copies: 1, 
      timestamp: '24 Jun 2026, 10:15 AM', 
      status: 'ready', 
      printCode: 'PM-7284' 
    },
    { 
      id: 2, 
      filename: '3 documents', 
      pages: 22, 
      copies: 2, 
      timestamp: '23 Jun 2026, 4:45 PM', 
      status: 'printing', 
      printCode: 'PM-9182' 
    },
    { 
      id: 3, 
      filename: 'Resume_Draft.pdf', 
      pages: 1, 
      copies: 5, 
      timestamp: '20 Jun 2026, 11:00 AM', 
      status: 'completed', 
      printCode: 'PM-0294' 
    }
  ]);

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

  const handleConfirmCheckout = () => {
    // Generate code
    const randCode = "PM-" + Math.floor(1000 + Math.random() * 9000);
    setGeneratedCode(randCode);

    // Create job details — sum across all files
    const totalPages = selectedFiles.reduce((acc, f) => acc + (f.pages || 1), 0);
    const totalCopies = Math.max(...selectedFiles.map(f => f.copies));
    const newJob = {
      id: Date.now(),
      filename: selectedFiles.length > 1 ? `${selectedFiles.length} documents` : selectedFiles[0].name,
      pages: totalPages,
      copies: totalCopies,
      timestamp: new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'ready',
      printCode: randCode
    };

    // Save job
    setJobs(prev => [newJob, ...prev]);

    // Show print code screen
    setCurrentPage('print-code');
  };

  const handlePrintAgain = (completedJob) => {
    const file = createFile(completedJob.filename, completedJob.pages, '1.2 MB');
    file.copies = completedJob.copies;
    setSelectedFiles([file]);
    setCurrentPage('checkout');
  };

  const handleLogout = () => {
    setSelectedFiles([
      createFile('Resume_Final.pdf', 2, '1.2 MB'),
      createFile('Project_Draft.pdf', 10, '4.8 MB')
    ]);
    setPaymentMethod('kiosk');
    setActiveTab('home');
    setCurrentPage('splash');
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden dark:bg-slate-900 text-on-surface dark:text-slate-200">
        
        {/* State rendering */}
        {currentPage === 'splash' && (
          <SplashScreen onFinish={() => setCurrentPage('main')} />
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
                />
              )}
            </div>

            {/* Persistent Bottom NavBar */}
            <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg z-50 flex items-center justify-around px-4 overflow-hidden">
              
              {/* Home */}
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
                  activeTab === 'home' 
                    ? 'bg-primary text-white px-5 py-2 rounded-full gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                {activeTab === 'home' && <span>Home</span>}
              </button>

              {/* My Jobs */}
              <button 
                onClick={() => setActiveTab('my-jobs')}
                className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
                  activeTab === 'my-jobs' 
                    ? 'bg-primary text-white px-5 py-2 rounded-full gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'my-jobs' ? "'FILL' 1" : "'FILL' 0" }}>description</span>
                {activeTab === 'my-jobs' && <span>My Jobs</span>}
              </button>

              {/* Info */}
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
                  activeTab === 'info' 
                    ? 'bg-primary text-white px-5 py-2 rounded-full gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'info' ? "'FILL' 1" : "'FILL' 0" }}>info</span>
                {activeTab === 'info' && <span>Info</span>}
              </button>

              {/* Profile */}
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
                  activeTab === 'profile' 
                    ? 'bg-primary text-white px-5 py-2 rounded-full gap-2 font-bold text-xs shadow-md shadow-primary/20' 
                    : 'text-slate-400 hover:text-primary'
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
            onDeleteFile={handleDeleteFile}
            onAddFile={handleAddFileInCheckout}
            onUpdateFileSettings={handleUpdateFileSettings}
            onBack={() => {
              setSelectedFiles([
                createFile('Resume_Final.pdf', 2, '1.2 MB'),
                createFile('Project_Draft.pdf', 10, '4.8 MB')
              ]);
              setCurrentPage('main');
              setActiveTab('home');
            }}
            onProceed={() => setCurrentPage('checkout-confirm')}
            onNavigateTab={(tab) => {
              setCurrentPage('main');
              setActiveTab(tab);
            }}
          />
        )}

        {currentPage === 'checkout-confirm' && (
          <CheckoutConfirmScreen 
            selectedFiles={selectedFiles}
            paymentMethod={paymentMethod}
            onChangePaymentMethod={setPaymentMethod}
            onBack={() => setCurrentPage('checkout')}
            onConfirm={handleConfirmCheckout}
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
