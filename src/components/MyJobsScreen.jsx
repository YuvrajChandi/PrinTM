import React, { useState } from 'react';
import Header from './Header';

export default function MyJobsScreen({ 
  jobs, 
  onViewQRCode, 
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
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-6">My Jobs</h2>

        {/* Segmented Control */}
        <div className="bg-surface-container-highest rounded-full p-1.5 flex mb-8 relative">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-full z-10 transition-colors duration-200 ${
                activeTab === 'active' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-full z-10 transition-colors duration-200 ${
                activeTab === 'completed' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            {/* Sliding Indicator */}
            <div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-surface-container-lowest rounded-full shadow-sm border border-outline-variant/20 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                transform: activeTab === 'active' ? 'translateX(0)' : 'translateX(100%)',
                left: '6px'
              }}
            ></div>
          </div>

        {/* Active Jobs Tab Content */}
        {activeTab === 'active' && (
          <section className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
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
                      <span className="material-symbols-outlined text-primary text-[24px]">
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
                      <p className="text-on-surface-variant/50 text-[10px] mt-1.5">{job.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
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
                      className="px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-md hover:bg-primary/5 active:scale-95 transition-all duration-200"
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
          <section className="space-y-4">
            {completedJobs.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] opacity-30 mb-2">history</span>
                <p className="text-sm">No completed jobs yet.</p>
              </div>
            ) : (
              completedJobs.map((job) => {
                const files = job.files || [];
                const totalCost = files.reduce((acc, f) => {
                  const rate = f.color === 'coloured' ? 10 : 3;
                  return acc + (f.pages || 1) * (f.copies || 1) * rate;
                }, 0);

                return (
                  <div 
                    key={job.id} 
                    className="card-standard flex flex-col gap-3.5 bg-surface-container-lowest/80 border border-outline-variant/20 hover:border-outline-variant/40 transition-all duration-200 shadow-sm animate-fade-in-up"
                  >
                    {/* Card Header: Job ID and Status */}
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface-variant tracking-wider">{job.id}</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Printed
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/70 font-medium">
                        {job.paymentMethod === 'kiosk' ? 'Paid at Kiosk' : 'Paid online'}
                      </span>
                    </div>

                    {/* Files List */}
                    <div className="flex flex-col gap-2">
                      {files.length === 0 ? (
                        <div className="flex items-center justify-between gap-3 text-xs bg-surface-container-low/40 p-2.5 rounded-xl border border-outline-variant/10">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 bg-surface-container-high rounded-lg flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-primary text-[16px]">
                                description
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-on-surface text-xs truncate max-w-[180px]">{job.filename}</p>
                              <p className="text-[10px] text-on-surface-variant/80 font-medium mt-0.5">
                                {job.pages} pages · {job.copies} {job.copies === 1 ? 'copy' : 'copies'}
                              </p>
                            </div>
                          </div>
                          <span className="font-extrabold text-on-surface/90 text-xs shrink-0">₹{(job.pages * job.copies * 3).toFixed(2)}</span>
                        </div>
                      ) : (
                        files.map((file, fIdx) => {
                          const rate = file.color === 'coloured' ? 10 : 3;
                          const fileCost = (file.pages || 1) * (file.copies || 1) * rate;
                          return (
                            <div 
                              key={fIdx} 
                              className="flex items-center justify-between gap-3 text-xs bg-surface-container-low/40 p-2.5 rounded-xl border border-outline-variant/10"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 bg-surface-container-high dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-primary text-[16px]">
                                    description
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-on-surface text-xs truncate max-w-[180px]">{file.name}</p>
                                  <p className="text-[10px] text-on-surface-variant/80 font-medium mt-0.5">
                                    {file.size} · {file.pages} {file.pages === 1 ? 'page' : 'pages'} · {file.copies} {file.copies === 1 ? 'copy' : 'copies'} · {file.color === 'coloured' ? 'Coloured' : 'B&W'}
                                  </p>
                                </div>
                              </div>
                              <span className="font-extrabold text-on-surface/90 text-xs shrink-0">₹{fileCost.toFixed(2)}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                    
                    {/* Bottom Metadata & Total Cost */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-outline-variant/10 mt-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-on-surface-variant/50 uppercase font-bold tracking-wider font-sans">Printed at</span>
                        <span className="font-bold text-on-surface-variant text-[11px] leading-none">{job.timestamp}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-on-surface-variant/50 uppercase font-bold tracking-wider block font-sans">Total paid</span>
                        <span className="font-extrabold text-secondary text-sm leading-none block mt-0.5">₹{totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

      </main>
    </div>
  );
}
