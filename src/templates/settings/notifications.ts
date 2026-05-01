export const notifications = `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Xpensify AI - Notification Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#c6c5d4",
                    "background": "#f9f9f9",
                    "on-error-container": "#93000a",
                    "primary-fixed": "#e0e0ff",
                    "surface-bright": "#f9f9f9",
                    "on-surface": "#1a1c1c",
                    "on-error": "#ffffff",
                    "tertiary": "#400007",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed": "#000767",
                    "on-secondary-fixed-variant": "#005312",
                    "on-primary-fixed-variant": "#343d96",
                    "on-secondary-container": "#217128",
                    "error": "#ba1a1a",
                    "outline": "#767683",
                    "on-tertiary-fixed-variant": "#80272b",
                    "surface-tint": "#4c56af",
                    "secondary-container": "#a0f399",
                    "on-secondary-fixed": "#002204",
                    "tertiary-fixed-dim": "#ffb3b1",
                    "surface-container": "#eeeeee",
                    "surface-container-low": "#f3f3f3",
                    "on-primary-container": "#8690ee",
                    "inverse-primary": "#bdc2ff",
                    "surface-variant": "#e2e2e2",
                    "secondary-fixed": "#a3f69c",
                    "secondary": "#1b6d24",
                    "on-tertiary": "#ffffff",
                    "tertiary-container": "#610f16",
                    "primary-container": "#1a237e",
                    "inverse-surface": "#2f3131",
                    "on-background": "#1a1c1c",
                    "on-primary": "#ffffff",
                    "primary": "#000666",
                    "on-tertiary-container": "#e87575",
                    "surface-dim": "#dadada",
                    "surface": "#f9f9f9",
                    "secondary-fixed-dim": "#88d982",
                    "error-container": "#ffdad6",
                    "surface-container-high": "#e8e8e8",
                    "surface-container-highest": "#e2e2e2",
                    "on-surface-variant": "#454652",
                    "inverse-on-surface": "#f1f1f1",
                    "primary-fixed-dim": "#bdc2ff",
                    "on-tertiary-fixed": "#410007",
                    "tertiary-fixed": "#ffdad8"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "touch-target-min": "48px",
                    "container-margin": "20px",
                    "base": "8px",
                    "gutter": "16px",
                    "card-padding": "16px"
            },
            "fontFamily": {
                    "headline-md": ["Inter"],
                    "body-base": ["Inter"],
                    "label-sm": ["Inter"],
                    "display-lg": ["Inter"],
                    "title-lg": ["Inter"]
            },
            "fontSize": {
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                    "body-base": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}]
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
<body class="bg-background text-on-background font-body-base min-h-screen pb-24">
<!-- Top App Bar EXACT HTML -->
<header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center h-16 px-5 w-full">
<button class="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95 duration-200 p-2 -ml-2 mr-3 flex items-center justify-center text-indigo-900 dark:text-indigo-100">
<span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
</button>
<h1 class="font-['Inter'] text-lg font-semibold text-indigo-900 dark:text-indigo-100 flex-1 truncate">Notification Settings</h1>
</header>
<main class="px-container-margin pt-[88px]">
<div class="mb-gutter">
<p class="font-body-base text-body-base text-on-surface-variant mb-6">Manage how and when you receive updates about your financial activities.</p>
</div>
<!-- Glassmorphism Container for Settings -->
<div class="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-outline-variant p-card-padding flex flex-col gap-gutter">
<!-- Transaction Alerts -->
<div class="flex items-start justify-between gap-4 pb-gutter border-b border-surface-variant" data-notification-row>
<div class="flex min-w-0 flex-1 items-start gap-3">
<div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed flex items-center justify-center mt-1">
<span class="material-symbols-outlined text-[20px]" data-icon="payments">payments</span>
</div>
<div class="min-w-0">
<h3 class="font-title-lg text-[16px] leading-[24px] text-on-surface">Transaction Alerts</h3>
<p class="font-body-base text-[14px] leading-[20px] text-on-surface-variant">Real-time alerts for all debits and credits.</p>
</div>
</div>
<!-- Toggle -->
<label class="relative flex h-7 w-12 shrink-0 cursor-pointer items-center" for="toggle1">
<input checked="" class="peer sr-only" id="toggle1" name="toggle" type="checkbox"/>
<span class="absolute inset-0 rounded-full border border-outline-variant bg-surface-container-high shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] transition-colors duration-300 peer-checked:border-primary peer-checked:bg-primary"></span>
<span class="pointer-events-none absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(26,35,126,0.2)] transition-transform duration-300 ease-out peer-checked:translate-x-5"></span>
</label>
</div>
<!-- Budget Reminders -->
<div class="flex items-start justify-between gap-4 pb-gutter border-b border-surface-variant" data-notification-row>
<div class="flex min-w-0 flex-1 items-start gap-3">
<div class="bg-primary-fixed p-2 rounded-lg text-on-primary-fixed flex items-center justify-center mt-1">
<span class="material-symbols-outlined text-[20px]" data-icon="warning">warning</span>
</div>
<div class="min-w-0">
<h3 class="font-title-lg text-[16px] leading-[24px] text-on-surface">Budget Reminders</h3>
<p class="font-body-base text-[14px] leading-[20px] text-on-surface-variant">Get notified when nearing budget limits.</p>
</div>
</div>
<!-- Toggle -->
<label class="relative flex h-7 w-12 shrink-0 cursor-pointer items-center" for="toggle2">
<input checked="" class="peer sr-only" id="toggle2" name="toggle" type="checkbox"/>
<span class="absolute inset-0 rounded-full border border-outline-variant bg-surface-container-high shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] transition-colors duration-300 peer-checked:border-primary peer-checked:bg-primary"></span>
<span class="pointer-events-none absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(26,35,126,0.2)] transition-transform duration-300 ease-out peer-checked:translate-x-5"></span>
</label>
</div>
</div>
<div class="mt-8 flex justify-center">
<button class="bg-primary text-on-primary font-title-lg text-title-lg w-full h-[56px] rounded-lg shadow-md hover:bg-surface-tint active:scale-95 transition-all duration-200">
                Save Preferences
            </button>
</div>
</main>
<!-- BottomNavBar -->
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
</body></html>`;
