export const budget = `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
<title>Xpensify AI - Budget Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "tertiary-fixed": "#ffdad8",
                    "on-surface-variant": "#454652",
                    "on-error": "#ffffff",
                    "on-primary": "#ffffff",
                    "inverse-primary": "#bdc2ff",
                    "surface-bright": "#f9f9f9",
                    "on-secondary-fixed-variant": "#005312",
                    "inverse-surface": "#2f3131",
                    "secondary-fixed": "#a3f69c",
                    "tertiary-fixed-dim": "#ffb3b1",
                    "surface": "#f9f9f9",
                    "secondary-container": "#a0f399",
                    "on-tertiary": "#ffffff",
                    "on-tertiary-fixed-variant": "#80272b",
                    "outline-variant": "#c6c5d4",
                    "surface-container-lowest": "#ffffff",
                    "primary": "#000666",
                    "on-secondary": "#ffffff",
                    "surface-container-high": "#e8e8e8",
                    "surface-container": "#eeeeee",
                    "on-tertiary-container": "#e87575",
                    "inverse-on-surface": "#f1f1f1",
                    "on-primary-fixed": "#000767",
                    "secondary-fixed-dim": "#88d982",
                    "tertiary": "#400007",
                    "tertiary-container": "#610f16",
                    "on-secondary-container": "#217128",
                    "on-primary-fixed-variant": "#343d96",
                    "on-primary-container": "#8690ee",
                    "on-tertiary-fixed": "#410007",
                    "surface-dim": "#dadada",
                    "primary-fixed-dim": "#bdc2ff",
                    "primary-container": "#1a237e",
                    "on-error-container": "#93000a",
                    "surface-container-low": "#f3f3f3",
                    "on-surface": "#1a1c1c",
                    "outline": "#767683",
                    "error-container": "#ffdad6",
                    "surface-container-highest": "#e2e2e2",
                    "secondary": "#1b6d24",
                    "on-secondary-fixed": "#002204",
                    "background": "#f9f9f9",
                    "error": "#ba1a1a",
                    "primary-fixed": "#e0e0ff",
                    "on-background": "#1a1c1c",
                    "surface-variant": "#e2e2e2",
                    "surface-tint": "#4c56af"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "container-margin": "20px",
                    "card-padding": "16px",
                    "gutter": "16px",
                    "touch-target-min": "48px",
                    "base": "8px"
            },
            "fontFamily": {
                    "display-lg": ["Inter"],
                    "body-base": ["Inter"],
                    "headline-md": ["Inter"],
                    "title-lg": ["Inter"],
                    "label-sm": ["Inter"]
            },
            "fontSize": {
                    "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                    "body-base": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}]
            }
          }
        }
      }
    </script>
    <style>
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        /* Hide number input spinners */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
        body {
          min-height: max(884px, 100dvh);
        }
        .modal-overlay {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-base antialiased min-h-screen pb-[80px]">
<!-- TopAppBar -->
<header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200 dark:border-slate-800 shadow-sm flex items-center h-16 px-5 w-full">
<button class="text-indigo-900 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200 p-2 -ml-2 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<h1 class="ml-2 font-['Inter'] font-semibold text-lg text-indigo-900 dark:text-indigo-100 flex-1 truncate">Budget Settings</h1>
</header>

<!-- Main Content Canvas -->
<main class="pt-20 px-container-margin pb-24 space-y-6 max-w-2xl mx-auto">
<!-- Monthly Budget Card -->
<section class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<div class="flex justify-between items-center mb-4">
<h2 class="font-title-lg text-title-lg text-on-surface">Monthly Budget</h2>
<button id="manual-budget-trigger" class="text-outline hover:text-primary transition-colors active:scale-95 w-8 h-8 flex items-center justify-center rounded-full">
<span class="material-symbols-outlined">tune</span>
</button>
</div>

<div id="slider-view" class="block">
<div class="flex items-end gap-2 mb-6">
<span id="budget-value" class="font-headline-md text-headline-md text-primary">₹50,000</span>
<span class="font-body-base text-body-base text-on-surface-variant pb-1">/ month</span>
</div>
<div class="space-y-4">
<input class="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary" id="budget-slider" max="100000" min="0" type="range" value="50000"/>
<div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>₹0</span>
<span>₹1L</span>
</div>
</div>
</div>

<div id="manual-view" class="hidden animate-in fade-in slide-in-from-top-2 duration-300">
<div class="flex items-center gap-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
<span class="text-primary font-bold text-lg shrink-0">₹</span>
<input type="number" id="manual-budget-input" class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-semibold text-lg p-0 min-w-0" placeholder="Enter amount">
<div class="flex items-center gap-1 shrink-0">
<button id="manual-cancel" class="w-10 h-10 flex items-center justify-center text-outline hover:text-error transition-colors active:scale-90">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
<div class="w-[1px] h-6 bg-outline-variant/50"></div>
<button id="manual-save" class="w-10 h-10 flex items-center justify-center text-primary hover:text-indigo-800 transition-colors active:scale-90">
<span class="material-symbols-outlined font-bold text-[20px]">check</span>
</button>
</div>
</div>
<p class="text-[11px] text-on-surface-variant mt-2 ml-1">Enter a value between 0 and 1,000,000</p>
</div>
</section>

<!-- Category Budgets -->
<section id="category-budgets-section" class="space-y-4">
<div class="flex justify-between items-center px-1">
<h3 class="font-title-lg text-title-lg text-on-surface">Category Budgets</h3>
<button id="add-category-budget-btn" class="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-all text-sm font-semibold flex items-center gap-1.5 active:scale-95 border border-primary/20">
<span class="material-symbols-outlined text-sm">add</span>
Add
</button>
</div>
<div id="category-budgets-list" class="grid gap-2">
<!-- Category budgets will be rendered here -->
<div class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-dashed border-outline-variant text-center py-8">
<p class="font-body-base text-body-base text-on-surface">No category budgets yet</p>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1 px-4">Allocate your overall budget to specific categories for better tracking.</p>
</div>
</div>
</section>

<!-- Alerts & Actions -->
<section class="space-y-6 pt-2">
<div id="budget-tracking-info" class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-between">
<div>
<h4 class="font-body-base text-body-base font-semibold text-on-surface">Budget tracking</h4>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Your monthly budget is saved below and will be used across the app.</p>
</div>
</div>
<button id="main-save-budget-btn" class="w-full h-[56px] mt-2 bg-primary text-on-primary rounded-xl font-title-lg text-title-lg shadow-md flex items-center justify-center hover:bg-primary/90 active:scale-[0.98] transition-all">Save All Changes</button>
</section>
</main>

<!-- Category Budget Modal -->
<div id="category-modal" class="fixed inset-0 z-[100] hidden">
<div class="modal-overlay absolute inset-0"></div>
<div class="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
<div class="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
<h3 class="font-headline-md text-xl text-on-surface mb-6">Set Category Budget</h3>

<div class="space-y-6">
<div>
<label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 ml-1">Select Category</label>
<div id="category-picker-grid" class="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
<!-- Categories will be rendered here -->
</div>
</div>

<div>
<label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 ml-1">Monthly Amount</label>
<div class="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
<span class="text-primary font-bold text-lg">₹</span>
<input type="number" id="modal-category-amount" class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-semibold text-lg p-0" placeholder="0">
</div>
</div>

<div class="flex gap-3 pt-2">
<button id="modal-cancel-btn" class="flex-1 h-[56px] rounded-xl font-title-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all">Cancel</button>
<button id="modal-save-btn" class="flex-1 h-[56px] rounded-xl font-title-lg bg-primary text-on-primary shadow-md hover:bg-primary/90 transition-all">Set Budget</button>
</div>
</div>
</div>
</div>

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
