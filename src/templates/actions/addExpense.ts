export const addExpense = `<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Xpensify AI - Add Expense</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "tertiary-container": "#610f16",
                      "on-tertiary-fixed": "#410007",
                      "on-primary-fixed-variant": "#343d96",
                      "surface-container-highest": "#e2e2e2",
                      "secondary-fixed": "#a3f69c",
                      "primary-fixed-dim": "#bdc2ff",
                      "primary-fixed": "#e0e0ff",
                      "surface": "#f9f9f9",
                      "secondary-container": "#a0f399",
                      "primary": "#000666",
                      "tertiary-fixed-dim": "#ffb3b1",
                      "on-background": "#1a1c1c",
                      "error-container": "#ffdad6",
                      "surface-container": "#eeeeee",
                      "on-error": "#ffffff",
                      "on-primary-container": "#8690ee",
                      "surface-dim": "#dadada",
                      "surface-bright": "#f9f9f9",
                      "on-secondary": "#ffffff",
                      "error": "#ba1a1a",
                      "primary-container": "#1a237e",
                      "on-surface": "#1a1c1c",
                      "surface-container-low": "#f3f3f3",
                      "background": "#f9f9f9",
                      "surface-container-high": "#e8e8e8",
                      "on-secondary-container": "#217128",
                      "inverse-primary": "#bdc2ff",
                      "on-error-container": "#93000a",
                      "surface-variant": "#e2e2e2",
                      "on-primary-fixed": "#000767",
                      "tertiary": "#400007",
                      "secondary-fixed-dim": "#88d982",
                      "outline-variant": "#c6c5d4",
                      "inverse-surface": "#2f3131",
                      "tertiary-fixed": "#ffdad8",
                      "on-secondary-fixed": "#002204",
                      "outline": "#767683",
                      "surface-container-lowest": "#ffffff",
                      "on-tertiary-container": "#e87575",
                      "on-primary": "#ffffff",
                      "on-secondary-fixed-variant": "#005312",
                      "inverse-on-surface": "#f1f1f1",
                      "secondary": "#1b6d24",
                      "on-tertiary-fixed-variant": "#80272b",
                      "on-tertiary": "#ffffff",
                      "on-surface-variant": "#454652",
                      "surface-tint": "#4c56af"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "touch-target-min": "48px",
                      "card-padding": "16px",
                      "gutter": "16px",
                      "container-margin": "20px",
                      "base": "8px"
              },
              "fontFamily": {
                      "label-sm": [
                              "Inter"
                      ],
                      "title-lg": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Inter"
                      ],
                      "display-lg": [
                              "Inter"
                      ],
                      "body-base": [
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
                      "title-lg": [
                              "20px",
                              {
                                      "lineHeight": "28px",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "700"
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
                      "body-base": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "400"
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
<body class="bg-background text-on-background min-h-screen pb-[100px]">
<!-- Updated TopAppBar to match Analytics Dashboard structure -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-200">
<div class="flex items-center">
<h1 class="text-xl font-bold text-indigo-900 dark:text-indigo-100 font-['Inter'] font-semibold text-lg">Add Expense</h1>
</div>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center">
<img alt="User profile photo" class="w-full h-full object-cover" data-alt="close-up portrait of a young professional with short dark hair, smiling gently against a bright background" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&accessories=shades&top=shortHair"/>
</div>
</header>
<!-- Main Canvas -->
<main class="pt-[88px] px-container-margin max-w-2xl mx-auto space-y-gutter">
<!-- Amount Input Card -->
<section class="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-center">
<p class="font-label-sm text-label-sm text-outline mb-2" style="">ENTER AMOUNT</p>
<div class="flex items-center justify-center gap-2">
<span class="font-headline-md text-headline-md text-on-surface" style="">₹</span>
<input autofocus="" class="font-display-lg text-display-lg text-on-surface bg-transparent border-none p-0 text-center focus:ring-0 w-full max-w-[200px]" id="amount-input" placeholder="0" type="number"/>
</div>
<!-- Transaction Type Switcher -->
<div class="flex p-1 bg-surface-container mt-6 rounded-lg">
<button class="flex-1 py-2 px-4 rounded-md bg-tertiary-container text-on-tertiary font-label-sm text-label-sm shadow-sm" style="">Expense</button>
<button class="flex-1 py-2 px-4 rounded-md text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high transition-colors" style="">Income</button>
</div>
</section>
<!-- Category Selection -->
<section class="space-y-base">
<h2 class="font-title-lg text-title-lg text-on-surface" style="">Category</h2>
<div id="expense-category-grid" class="grid grid-cols-3 gap-2.5 auto-rows-fr">
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-primary-fixed px-2 py-2 border-2 border-primary" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-primary" style='font-variation-settings: "FILL" 1;'>restaurant</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Food</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">directions_car</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Transport</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">shopping_bag</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Shopping</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">home</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Housing</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">receipt_long</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Bills</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">movie</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Entertainment</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">favorite</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Health</span>
</button>
<button class="flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-surface-container-lowest px-2 py-2 border border-surface-container-high hover:bg-surface-container-low transition-colors" style="">
<span class="material-symbols-outlined shrink-0 text-[20px] leading-none text-outline" style="">more_horiz</span>
<span class="w-full break-all text-center text-[11px] font-medium leading-4 tracking-normal text-on-surface" style="">Other</span>
</button>
</div>
</section>
<!-- Details Form -->
<section class="space-y-6">
<!-- Date Picker -->
<div class="relative cursor-pointer" id="date-trigger">
<label class="font-label-sm text-[11px] uppercase tracking-wider text-primary absolute -top-2.5 left-4 z-10 bg-white dark:bg-slate-900 px-2 font-bold select-none" style="">Date</label>
<div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-2xl px-4 py-4 mt-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all hover:bg-surface-container-low">
<span class="material-symbols-outlined text-outline mr-3 text-[22px]" style="">calendar_today</span>
<span class="font-body-base text-body-base text-on-surface font-medium" id="date-display">Select Date</span>
</div>
</div>
<!-- Notes/Memo -->
<div class="relative">
<label class="font-label-sm text-[11px] uppercase tracking-wider text-primary absolute -top-2.5 left-4 z-10 bg-white dark:bg-slate-900 px-2 font-bold select-none" style="">Notes</label>
<div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-2xl px-4 py-4 mt-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
<span class="material-symbols-outlined text-outline mr-3 text-[22px]" style="">description</span>
<input class="w-full bg-transparent border-none p-0 focus:ring-0 font-body-base text-body-base text-on-surface font-medium" id="note-input" placeholder="Add a note" type="text"/>
</div>
</div>
</section>

<!-- Date Picker Modal -->
<div id="date-picker-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-container-margin bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
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
<!-- Save Action -->
<section class="pt-4">
<button class="w-full h-[56px] bg-primary text-on-primary rounded-xl font-title-lg text-title-lg flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-95 transition-transform" style="">
                Save Expense
            </button>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:hidden">
<a data-stitch-route="dashboard" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-['Inter'] text-[10px] font-medium">Home</span>
</a>
<a data-stitch-route="analytics" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="font-['Inter'] text-[10px] font-medium">Analytics</span>
</a>
<a data-stitch-route="addExpense" class="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-2xl px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="add" style="font-variation-settings: 'FILL' 1;">add</span>
<span class="font-['Inter'] text-[10px] font-medium">Add</span>
</a>
<a data-stitch-route="transactions" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-['Inter'] text-[10px] font-medium">History</span>
</a>
<a data-stitch-route="profile" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-['Inter'] text-[10px] font-medium">Profile</span>
</a>
</nav>
</body></html>`;
