import React, { useState } from 'react';
import Header from './Header';

export default function MyJobsScreen({ 
  jobs, 
  onViewQRCode, 
  onPrintAgain,
  onNavigateTab
}) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'

  const activeJobs = jobs.filter(job => job.status === 'ready' || job.status === 'printing');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <Header onNavigateTab={onNavigateTab} />

      {/* Scrollable Container */}
      <main className="flex-grow overflow-y-auto py-6 px-6 pb-24">
        <h2 className="text-[32px] font-extrabold tracking-tight text-on-surface mb-6 px-2">My Jobs</h2>

        {/* Segmented Control */}
        <div className="mx-2">
          <div className="bg-surface-container-highest rounded-2xl p-1 flex mb-8 relative">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg z-10 transition-colors ${
                activeTab === 'active' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg z-10 transition-colors ${
                activeTab === 'completed' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            {/* Sliding Indicator */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                transform: activeTab === 'active' ? 'translateX(0)' : 'translateX(100%)',
                left: '2px'
              }}
            ></div>
          </div>
        </div>

        {/* Active Jobs Tab Content */}
        {activeTab === 'active' && (
          <section className="space-y-4 px-2">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-[48px] opacity-30 mb-2">print</span>
                <p className="text-sm">No active printing jobs.</p>
              </div>
            ) : (
              activeJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="card-standard flex flex-col gap-4 animate-fade-in-up"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl shrink-0">
                      <span className="material-symbols-outlined text-primary text-[28px]">
                        {job.filesCount > 1 ? 'folder_open' : 'description'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-on-surface text-sm truncate leading-tight mb-1">
                        {job.filename}
                      </h3>
                      <p className="text-on-surface-variant text-xs">
                        {job.pages} pages · {job.copies} {job.copies === 1 ? 'copy' : 'copies'}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1.5">{job.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    {job.status === 'ready' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/30 text-secondary rounded-full text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Ready to print
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Printing...
                      </span>
                    )}
                    <button 
                      onClick={() => onViewQRCode(job.printCode)}
                      className="px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-xl hover:bg-primary/5 active:scale-95 transition-all"
                    >
                      View QR Code
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* Completed Jobs Tab Content */}
        {activeTab === 'completed' && (
          <section className="space-y-4 px-2">
            {completedJobs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-[48px] opacity-30 mb-2">history</span>
                <p className="text-sm">No completed jobs yet.</p>
              </div>
            ) : (
              completedJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="card-standard flex flex-col gap-4 opacity-75"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-xl shrink-0">
                      <span className="material-symbols-outlined text-slate-400 text-[28px]">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate leading-tight mb-1">
                        {job.filename}
                      </h3>
                      <p className="text-on-surface-variant text-xs">
                        {job.pages} pages · {job.copies} {job.copies === 1 ? 'copy' : 'copies'}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1.5">{job.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Completed
                    </span>
                    <button 
                      onClick={() => onPrintAgain(job)}
                      className="px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-xl hover:bg-primary/5 active:scale-95 transition-all"
                    >
                      Print Again
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

      </main>
    </div>
  );
}
