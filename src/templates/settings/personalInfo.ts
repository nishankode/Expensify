export const personalInfo = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Xpensify AI - Personal Information</title>
<!-- Google Fonts & Material Symbols -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Configuration -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface-container-lowest": "#ffffff",
                        "on-secondary": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "tertiary-container": "#610f16",
                        "secondary-container": "#a0f399",
                        "on-surface": "#1a1c1c",
                        "inverse-on-surface": "#f1f1f1",
                        "on-surface-variant": "#454652",
                        "on-primary-fixed-variant": "#343d96",
                        "surface-dim": "#dadada",
                        "on-tertiary-container": "#e87575",
                        "surface-container": "#eeeeee",
                        "surface-tint": "#4c56af",
                        "outline": "#767683",
                        "on-tertiary-fixed-variant": "#80272b",
                        "tertiary-fixed": "#ffdad8",
                        "surface-variant": "#e2e2e2",
                        "secondary-fixed": "#a3f69c",
                        "on-primary-container": "#8690ee",
                        "on-secondary-fixed-variant": "#005312",
                        "surface-container-low": "#f3f3f3",
                        "background": "#f9f9f9",
                        "secondary": "#1b6d24",
                        "on-primary": "#ffffff",
                        "surface": "#f9f9f9",
                        "tertiary": "#400007",
                        "on-secondary-fixed": "#002204",
                        "on-primary-fixed": "#000767",
                        "on-error": "#ffffff",
                        "on-tertiary-fixed": "#410007",
                        "primary-fixed-dim": "#bdc2ff",
                        "on-background": "#1a1c1c",
                        "surface-container-highest": "#e2e2e2",
                        "surface-bright": "#f9f9f9",
                        "inverse-primary": "#bdc2ff",
                        "tertiary-fixed-dim": "#ffb3b1",
                        "secondary-fixed-dim": "#88d982",
                        "outline-variant": "#c6c5d4",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#217128",
                        "inverse-surface": "#2f3131",
                        "error": "#ba1a1a",
                        "primary-fixed": "#e0e0ff",
                        "primary": "#000666",
                        "surface-container-high": "#e8e8e8",
                        "primary-container": "#1a237e",
                        "on-error-container": "#93000a"
                    },
                    borderRadius: {
                        DEFAULT: "0.25rem",
                        lg: "0.5rem",
                        xl: "0.75rem",
                        full: "9999px"
                    },
                    spacing: {
                        "card-padding": "16px",
                        "container-margin": "20px",
                        "base": "8px",
                        "touch-target-min": "48px",
                        "gutter": "16px"
                    },
                    fontFamily: {
                        "display-lg": ["Inter"],
                        "body-base": ["Inter"],
                        "headline-md": ["Inter"],
                        "title-lg": ["Inter"],
                        "label-sm": ["Inter"]
                    },
                    fontSize: {
                        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "800" }],
                        "body-base": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
                        "title-lg": ["20px", { lineHeight: "28px", fontWeight: "600" }],
                        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }]
                    }
                }
            }
        }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="bg-background text-on-surface font-body-base min-h-screen pb-24 flex flex-col items-center">
<div class="w-full max-w-md bg-background min-h-screen relative shadow-2xl overflow-hidden">
<!-- TopAppBar (From JSON) -->
<header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md docked full-width top-0 sticky z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center px-5 h-16 w-full">
<button class="text-indigo-900 dark:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:opacity-70 transition-opacity p-2 -ml-2 rounded-full mr-3 flex items-center justify-center" style="">
<span class="material-symbols-outlined" style="">arrow_back</span>
</button>
<h1 class="font-sans antialiased text-base font-semibold text-indigo-900 dark:text-indigo-300" style="">Personal Information</h1>
</header>
<!-- Main Content -->
<main class="px-container-margin py-6 flex flex-col gap-6">
<!-- Form Details -->
<section class="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-card-padding flex flex-col gap-5">
<!-- Full Name -->
<div class="flex flex-col gap-1.5">
<label class="font-label-sm text-label-sm text-on-surface-variant ml-1" style="">Full Name</label>
<div class="flex items-center bg-surface-container-low rounded-lg px-4 h-touch-target-min focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
<span class="material-symbols-outlined text-outline mr-3" style="">person</span>
<input id="full-name-input" class="w-full bg-transparent border-none p-0 font-body-base text-body-base text-on-surface focus:ring-0" type="text" value="User"/>
</div>
</div>
<!-- Email -->
<div class="flex flex-col gap-1.5">
<label class="font-label-sm text-label-sm text-on-surface-variant ml-1" style="">Email</label>
<div class="flex items-center bg-surface-container-low rounded-lg px-4 h-touch-target-min focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
<span class="material-symbols-outlined text-outline mr-3" style="">mail</span>
<input id="email-input" class="w-full bg-transparent border-none p-0 font-body-base text-body-base text-on-surface focus:ring-0" type="email" value="user@example.com"/>
</div>
</div>
<!-- Mobile Number -->
<div class="flex flex-col gap-1.5">
<label class="font-label-sm text-label-sm text-on-surface-variant ml-1" style="">Mobile Number (Optional)</label>
<div class="flex items-center bg-surface-container-low rounded-lg px-4 h-touch-target-min focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
<span class="material-symbols-outlined text-outline mr-3" style="">phone_iphone</span>
<span class="text-on-surface-variant font-body-base text-body-base mr-2 border-r border-outline-variant pr-2" style="">+91</span>
<input id="phone-input" class="w-full bg-transparent border-none p-0 font-body-base text-body-base text-on-surface focus:ring-0" type="tel" value="00000 00000"/>
</div>
</div>
<!-- Date of Birth -->
<div class="flex flex-col gap-1.5">
<label class="font-label-sm text-label-sm text-on-surface-variant ml-1" style="">DOB (Optional)</label>
<div id="date-trigger" class="flex items-center bg-surface-container-low rounded-lg px-4 h-touch-target-min focus-within:ring-2 focus-within:ring-primary/20 transition-shadow cursor-pointer hover:bg-surface-container">
<span class="material-symbols-outlined text-outline mr-3 shadow-sm" style="">calendar_month</span>
<input id="dob-display" class="w-full bg-transparent border-none p-0 font-body-base text-body-base text-on-surface font-medium focus:ring-0 pointer-events-none" readonly type="text" value="Select date"/>
</div>
</div>
</section>
<!-- Action Button -->
<button class="w-full h-[56px] mt-2 bg-primary text-on-primary rounded-xl font-title-lg text-title-lg shadow-md flex items-center justify-center hover:bg-primary/90 active:scale-[0.98] transition-all" style="">
                Save Changes
            </button>
</main>
<!-- Date Picker Modal -->
<div id="date-picker-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-container-margin bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
  <div id="date-picker-content" class="bg-surface w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300">
    <div class="p-5 border-b border-surface-container-highest flex justify-between items-center bg-primary text-white">
      <button id="calendar-month-year" class="font-title-lg text-lg tracking-tight hover:bg-white/10 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
        <span>April 2024</span>
        <span class="material-symbols-outlined text-sm">expand_more</span>
      </button>
      <div class="flex gap-2">
        <button id="prev-month" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button id="next-month" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
    <div class="relative h-[320px]">
      <div id="calendar-view" class="p-4">
        <div class="grid grid-cols-7 mb-2 text-center text-outline font-label-sm text-[10px] uppercase tracking-tighter">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
        <div id="calendar-grid" class="grid grid-cols-7 gap-1">
          <!-- Days injected here -->
        </div>
      </div>
      <!-- Year Selector View (Hidden by default) -->
      <div id="year-selector" class="absolute inset-0 bg-surface z-10 p-4 hidden overflow-y-auto">
        <div class="grid grid-cols-3 gap-2" id="years-grid">
          <!-- Years injected here -->
        </div>
      </div>
    </div>
    <div class="p-4 border-t border-surface-container-highest flex justify-end gap-3 bg-surface-container-low/30">
      <button id="close-date-picker" class="px-5 py-2 text-primary font-semibold hover:bg-primary/5 rounded-xl transition-colors">Cancel</button>
      <button id="ok-btn" class="px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">Ok</button>
    </div>
  </div>
</div>
<!-- BottomNavBar (From JSON) -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-['Inter'] text-[10px] font-medium">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="font-['Inter'] text-[10px] font-medium">Analytics</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="add">add</span>
<span class="font-['Inter'] text-[10px] font-medium">Add</span>
</a>
<a class="flex flex-col items-center justify-center px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90 text-slate-400 dark:text-slate-500" href="#">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-['Inter'] text-[10px] font-medium">History</span>
</a>
<a class="flex flex-col items-center justify-center px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-2xl" href="#">
<span class="material-symbols-outlined" data-icon="person" style="font-variation-settings: 'FILL' 1;">person</span>
<span class="font-['Inter'] text-[10px] font-medium">Profile</span>
</a>
</nav>
</div>
</body></html>`;
