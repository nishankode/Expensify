export const transactions = `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Xpensify AI - Transactions</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "outline": "#767683",
                      "surface-container-high": "#e8e8e8",
                      "on-tertiary": "#ffffff",
                      "tertiary-fixed-dim": "#ffb3b1",
                      "tertiary-container": "#610f16",
                      "on-secondary-fixed": "#002204",
                      "secondary": "#1b6d24",
                      "tertiary": "#400007",
                      "outline-variant": "#c6c5d4",
                      "on-error-container": "#93000a",
                      "on-tertiary-container": "#e87575",
                      "on-background": "#1a1c1c",
                      "on-secondary-fixed-variant": "#005312",
                      "primary": "#000666",
                      "error-container": "#ffdad6",
                      "surface-dim": "#dadada",
                      "secondary-fixed-dim": "#88d982",
                      "on-error": "#ffffff",
                      "surface-container-highest": "#e2e2e2",
                      "primary-fixed": "#e0e0ff",
                      "surface-variant": "#e2e2e2",
                      "surface": "#f9f9f9",
                      "primary-fixed-dim": "#bdc2ff",
                      "inverse-on-surface": "#f1f1f1",
                      "error": "#ba1a1a",
                      "on-primary-fixed": "#000767",
                      "on-primary-container": "#8690ee",
                      "background": "#f9f9f9",
                      "on-secondary-container": "#217128",
                      "surface-container-lowest": "#ffffff",
                      "primary-container": "#1a237e",
                      "surface-container": "#eeeeee",
                      "on-tertiary-fixed-variant": "#80272b",
                      "on-surface": "#1a1c1c",
                      "tertiary-fixed": "#ffdad8",
                      "inverse-surface": "#2f3131",
                      "on-surface-variant": "#454652",
                      "surface-tint": "#4c56af",
                      "secondary-container": "#a0f399",
                      "on-tertiary-fixed": "#410007",
                      "surface-bright": "#f9f9f9",
                      "on-primary": "#ffffff",
                      "surface-container-low": "#f3f3f3",
                      "inverse-primary": "#bdc2ff",
                      "on-secondary": "#ffffff",
                      "secondary-fixed": "#a3f69c",
                      "on-primary-fixed-variant": "#343d96"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "card-padding": "16px",
                      "container-margin": "20px",
                      "base": "8px",
                      "touch-target-min": "48px",
                      "gutter": "16px"
              },
              "fontFamily": {
                      "label-sm": [
                              "Inter"
                      ],
                      "body-base": [
                              "Inter"
                      ],
                      "display-lg": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Inter"
                      ],
                      "title-lg": [
                              "Inter"
                      ]
              },
              "fontSize": {
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.05em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-base": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "400"
                              }
                      ],
                      "display-lg": [
                              "40px",
                              {
                                      "lineHeight": "48px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "800"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "700"
                              }
                      ],
                      "title-lg": [
                              "20px",
                              {
                                      "lineHeight": "28px",
                                      "fontWeight": "600"
                              }
                      ]
              }
      },
          },
        }
      </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="bg-background text-on-background pb-24 pt-16">
<!-- TopAppBar from JSON -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-200 active:scale-95">
<div class="flex items-center">
<h1 class="text-xl font-bold text-indigo-900 dark:text-indigo-100 font-['Inter'] font-semibold text-lg">Transactions</h1>
</div>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center">
<img alt="User profile photo" class="w-full h-full object-cover" data-alt="close-up portrait of a young professional with short dark hair, smiling gently against a bright background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxahYzLEpp2ImcGFgc0CCkLe2FyxPsDCOW096Qvg1HtTiOt0Wc-G9gaoGvj11AehWVPEOiN9fEUEZ25DK0DKIZoRdHFJxvyFBhkTCc8cQ7ASksAAfKl3QyKazAGPwWDuGUJQ7qQOriRhssnHT6HjGQN80PY8xxp2ZchA4aMJyJ7yB35JmYYV8UeDk5rgaETScqLgA1RLoVd2PxClx7QaUcq1_9mybkiyIkU3nBppmN1MNixQ4yYXEa1fOwNj1X4ZNinbaYlI8HiNn7"/>
</div>
</header>
<main class="px-container-margin py-base flex flex-col gap-6">
<!-- Search Bar -->
<div class="mt-base mb-gutter relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="material-symbols-outlined text-outline" data-icon="search">search</span>
  </div>
  <input class="w-full h-[48px] pl-10 pr-24 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" placeholder="Search transactions..." type="text"/>
  <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
    <button id="clear-date-btn" class="hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-error/10 text-error transition-all active:scale-90">
      <span class="material-symbols-outlined text-[20px]">close</span>
    </button>
    <div class="relative flex items-center">
      <button id="date-filter-btn" class="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary transition-all active:scale-95 shadow-sm border border-outline-variant/30">
        <span class="material-symbols-outlined text-[24px]">calendar_month</span>
      </button>
    </div>
  </div>
</div>

<!-- Date Picker Modal -->
<div id="date-picker-modal" class="fixed inset-0 z-[60] flex items-center justify-center p-container-margin bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
  <div id="date-picker-content" class="bg-surface w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300">
    <div class="p-5 border-b border-surface-container-highest flex justify-between items-center bg-primary text-white">
      <h3 id="calendar-month-year" class="font-title-lg text-lg">April 2024</h3>
      <div class="flex gap-2">
        <button id="prev-month" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button id="next-month" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
    <div class="p-4">
      <div class="grid grid-cols-7 mb-2 text-center text-outline font-label-sm text-[10px] uppercase tracking-tighter">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>
      <div id="calendar-days" class="grid grid-cols-7 gap-1">
        <!-- Days injected here -->
      </div>
    </div>
    <div class="p-4 border-t border-surface-container-highest flex justify-end gap-3">
      <button id="close-date-picker" class="px-5 py-2 text-primary font-semibold hover:bg-primary/5 rounded-xl transition-colors">Cancel</button>
      <button id="ok-btn" class="px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">Ok</button>
    </div>
  </div>
</div>

<!-- Filter Chips -->
<div class="flex overflow-x-auto gap-2 pb-2 mb-gutter no-scrollbar scroll-smooth" id="filter-chips-container">
</div>
<!-- Transactions List -->
<div class="space-y-6" id="transactions-list-container">
<!-- Group: Today -->
<div>
<h2 class="font-label-sm text-label-sm text-outline mb-3 uppercase tracking-wider">Today</h2>
<div class="bg-surface rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] border border-surface-container-highest overflow-hidden">
<!-- Transaction Item 1 -->
<div class="flex items-center justify-between p-card-padding border-b border-surface-container-highest last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#E65100]">
<span class="material-symbols-outlined" data-icon="restaurant">restaurant</span>
</div>
<div>
<h3 class="font-title-lg text-[16px] text-on-surface">Starbucks</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">09:45 AM • Food &amp; Drink</p>
</div>
</div>
<div class="text-right">
<span class="font-title-lg text-[16px] text-error font-medium">-₹450.00</span>
</div>
</div>
<!-- Transaction Item 2 -->
<div class="flex items-center justify-between p-card-padding border-b border-surface-container-highest last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
</div>
<div>
<h3 class="font-title-lg text-[16px] text-on-surface">Salary Credit</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">08:00 AM • Income</p>
</div>
</div>
<div class="text-right">
<span class="font-title-lg text-[16px] text-secondary font-medium">+₹85,000.00</span>
</div>
</div>
</div>
</div>
<!-- Group: Yesterday -->
<div>
<h2 class="font-label-sm text-label-sm text-outline mb-3 uppercase tracking-wider">Yesterday</h2>
<div class="bg-surface rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] border border-surface-container-highest overflow-hidden">
<!-- Transaction Item 3 -->
<div class="flex items-center justify-between p-card-padding border-b border-surface-container-highest last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[#1565C0]">
<span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
</div>
<div>
<h3 class="font-title-lg text-[16px] text-on-surface">Amazon India</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">04:30 PM • Shopping</p>
</div>
</div>
<div class="text-right">
<span class="font-title-lg text-[16px] text-error font-medium">-₹2,150.00</span>
</div>
</div>
<!-- Transaction Item 4 -->
<div class="flex items-center justify-between p-card-padding border-b border-surface-container-highest last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#6A1B9A]">
<span class="material-symbols-outlined" data-icon="directions_car">directions_car</span>
</div>
<div>
<h3 class="font-title-lg text-[16px] text-on-surface">Uber Rides</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">10:15 AM • Transport</p>
</div>
</div>
<div class="text-right">
<span class="font-title-lg text-[16px] text-error font-medium">-₹320.00</span>
</div>
</div>
<!-- Transaction Item 5 -->
<div class="flex items-center justify-between p-card-padding border-b border-surface-container-highest last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
<span class="material-symbols-outlined" data-icon="local_hospital">local_hospital</span>
</div>
<div>
<h3 class="font-title-lg text-[16px] text-on-surface">Apollo Pharmacy</h3>
<p class="font-label-sm text-label-sm text-on-surface-variant">09:00 AM • Health</p>
</div>
</div>
<div class="text-right">
<span class="font-title-lg text-[16px] text-error font-medium">-₹850.00</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- BottomNavBar from JSON -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:hidden">
<a data-stitch-route="dashboard" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-['Inter'] text-[10px] font-medium">Home</span>
</a>
<a data-stitch-route="analytics" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="font-['Inter'] text-[10px] font-medium">Analytics</span>
</a>
<a data-stitch-route="addExpense" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="add">add</span>
<span class="font-['Inter'] text-[10px] font-medium">Add</span>
</a>
<a data-stitch-route="transactions" class="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-2xl px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="history" style="font-variation-settings: 'FILL' 1;">history</span>
<span class="font-['Inter'] text-[10px] font-medium">History</span>
</a>
<a data-stitch-route="profile" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-['Inter'] text-[10px] font-medium">Profile</span>
</a>
</nav>
<style>
        /* Utility to hide scrollbar but keep functionality for chips */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</body></html>`;
