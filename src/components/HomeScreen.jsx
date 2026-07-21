import React, { useRef, useState } from 'react';
import Header from './Header';
import { MockApi } from '../services/mockApi';

export default function HomeScreen({
  onUploadFile,
  onSelectQuickTemplate,
  activeJobsCount,
  onNavigateTab,
  userName = "Student"
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
            const data = await MockApi.uploadFile(file);
            onUploadFile({
              name: data.fileName,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              pages: data.pageCount,
              previewUrl: data.previewUrl
            });
          } else {
            alert("Only PDF files are supported!");
          }
        }
      } catch (err) {
        alert("Upload failed: " + err.message);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-24">
      <Header onNavigateTab={onNavigateTab} />

      {/* Main content */}
      <main className="p-6 flex flex-col gap-8 flex-1">

        {/* Hero Section with Upload */}
        <section className="relative w-full rounded-3xl overflow-hidden gradient-primary text-white shadow-[0_8px_30px_rgba(0,89,187,0.25)] p-8 flex flex-col items-start mt-2">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-48 h-48 bg-secondary/40 rounded-full blur-2xl pointer-events-none"></div>

          <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[100px] -rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
              print
            </span>
          </div>

          {/* Welcome Text */}
          <div className="relative z-10 w-full mb-8">
            <h2 className="text-[32px] leading-[1.1] font-black tracking-tight text-white drop-shadow-sm mb-3">
              Hello,<br />{userName} <span className="inline-block animate-wave origin-bottom-right">👋</span>
            </h2>
            <p className="text-white/85 text-sm font-medium leading-relaxed max-w-[80%]">
              Ready to print? Upload your documents and skip the line at the kiosk.
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            multiple
            className="hidden"
          />

          {/* Upload Button */}
          <button
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="relative z-10 w-full bg-white text-primary dark:text-[#0059bb] font-bold py-3.5 px-5 flex items-center gap-4 rounded-xl active:scale-[0.97] transition-all shadow-lg hover:shadow-xl group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-primary/10 dark:bg-[#0059bb]/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200 shrink-0">
              {isUploading ? (
                <span className="material-symbols-outlined text-[26px] animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
              )}
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[16px] leading-tight font-extrabold">
                {isUploading ? 'Uploading...' : 'Upload PDF'}
              </span>
              <span className="text-[11px] text-primary/60 dark:text-[#0059bb]/60 font-bold uppercase tracking-wider mt-0.5">
                {isUploading ? 'Please wait' : 'Max 50 MB'}
              </span>
            </div>
            {!isUploading && (
              <div className="ml-auto bg-primary/5 dark:bg-[#0059bb]/5 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            )}
          </button>
        </section>

        {/* Quick Print templates */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">Quick Print</h3>
            <button className="text-[11px] font-semibold text-primary py-1.5 px-3 rounded-lg hover:bg-primary/5 active:scale-[0.97] transition-all duration-200">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* 1) Admission Form */}
            <div
              onClick={() => onSelectQuickTemplate('Admission_Form.pdf', 3)}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-md transition-all cursor-pointer group active:scale-98"
            >
              <div className="w-full aspect-[3/4] bg-surface-container-low rounded-2xl border border-outline-variant/30 p-2.5 flex flex-col gap-1.5 relative overflow-hidden shadow-inner group-hover:border-primary/20 transition-all">
                <div className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm leading-tight">PDF</div>
                <div className="w-8 h-1 bg-primary/25 rounded"></div>

                {/* Form header and thumbnail */}
                <div className="flex gap-1.5 items-start mt-1">
                  <div className="flex-grow flex flex-col gap-1">
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-[85%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-[70%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="w-6 h-6 rounded border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[8px] text-slate-300">person</span>
                  </div>
                </div>

                {/* Form lines */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded"></div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded"></div>
                  <div className="w-[90%] h-1 bg-slate-100 dark:bg-slate-850 rounded"></div>
                </div>

                {/* Bottom line signatures */}
                <div className="flex justify-between items-center mt-auto">
                  <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate block group-hover:text-primary transition-colors">Admission Form</span>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">3 pages · Form</p>
              </div>
            </div>

            {/* 2) Index Page */}
            <div
              onClick={() => onSelectQuickTemplate('Index_Page.pdf', 1)}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-md transition-all cursor-pointer group active:scale-98"
            >
              <div className="w-full aspect-[3/4] bg-surface-container-low rounded-2xl border border-outline-variant/30 p-2.5 flex flex-col gap-1.5 relative overflow-hidden shadow-inner group-hover:border-primary/20 transition-all">
                <div className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm leading-tight">PDF</div>
                <div className="w-12 h-1 bg-primary/25 rounded mx-auto mb-1"></div>

                {/* Index Lines (Chapter dots and numbers) */}
                <div className="flex flex-col gap-2 mt-1.5">
                  <div className="flex justify-between items-center">
                    <div className="w-[60%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-1.5 h-1 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-[75%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-1.5 h-1 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-[50%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-1.5 h-1 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-[80%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-1.5 h-1 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-[65%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-1.5 h-1 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>

                <div className="w-4 h-1 bg-slate-200 dark:bg-slate-700 rounded mt-auto mx-auto"></div>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate block group-hover:text-primary transition-colors">Index Page</span>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">1 page · Page</p>
              </div>
            </div>

            {/* 3) Back Form */}
            <div
              onClick={() => onSelectQuickTemplate('Back_Form.pdf', 2)}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-md transition-all cursor-pointer group active:scale-98"
            >
              <div className="w-full aspect-[3/4] bg-surface-container-low rounded-2xl border border-outline-variant/30 p-2.5 flex flex-col gap-1.5 relative overflow-hidden shadow-inner group-hover:border-primary/20 transition-all">
                <div className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm leading-tight">PDF</div>

                {/* 2 column terms document layout */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex flex-col gap-1">
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-[85%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-[90%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-[80%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-[70%] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>

                <div className="w-full h-1 bg-slate-150 dark:bg-slate-700 rounded mt-auto"></div>
                <div className="flex justify-between items-center mt-1">
                  <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate block group-hover:text-primary transition-colors">Back Form</span>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">2 pages · Form</p>
              </div>
            </div>

            {/* 4) Summer Internship Form */}
            <div
              onClick={() => onSelectQuickTemplate('Summer_Internship_Form.pdf', 2)}
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-md transition-all cursor-pointer group active:scale-98"
            >
              <div className="w-full aspect-[3/4] bg-surface-container-low rounded-2xl border border-outline-variant/30 p-2.5 flex flex-col gap-1.5 relative overflow-hidden shadow-inner group-hover:border-primary/20 transition-all">
                <div className="absolute top-1.5 right-1.5 bg-rose-500 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm leading-tight">PDF</div>
                <div className="w-10 h-1 bg-primary/25 rounded mx-auto mb-1"></div>

                {/* Checklist layout */}
                <div className="flex flex-col gap-1.5 mt-1.5">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-sm border border-slate-300 dark:border-slate-600 shrink-0"></div>
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-sm border border-slate-300 dark:border-slate-600 shrink-0"></div>
                    <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-sm border border-slate-300 dark:border-slate-600 shrink-0"></div>
                    <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>

                {/* Dashed signature box */}
                <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded p-1 mt-auto">
                  <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate block group-hover:text-primary transition-colors">Summer Internship Form</span>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">2 pages · Form</p>
              </div>
            </div>

          </div>
        </section>


      </main>
    </div>
  );
}
