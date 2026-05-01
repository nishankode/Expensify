export const dashboard = `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Xpensify AI - Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-secondary-container": "#217128",
                        "primary-container": "#1a237e",
                        "surface-container-low": "#f3f3f3",
                        "on-secondary-fixed-variant": "#005312",
                        "on-error": "#ffffff",
                        "inverse-surface": "#2f3131",
                        "secondary-fixed-dim": "#88d982",
                        "tertiary-fixed": "#ffdad8",
                        "on-tertiary": "#ffffff",
                        "on-primary": "#ffffff",
                        "tertiary-container": "#610f16",
                        "background": "#f9f9f9",
                        "primary-fixed": "#e0e0ff",
                        "on-background": "#1a1c1c",
                        "surface-tint": "#4c56af",
                        "surface": "#f9f9f9",
                        "surface-bright": "#f9f9f9",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-fixed-variant": "#343d96",
                        "surface-variant": "#e2e2e2",
                        "on-primary-fixed": "#000767",
                        "error-container": "#ffdad6",
                        "tertiary-fixed-dim": "#ffb3b1",
                        "on-tertiary-fixed": "#410007",
                        "surface-container-highest": "#e2e2e2",
                        "on-tertiary-fixed-variant": "#80272b",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#8690ee",
                        "outline-variant": "#c6c5d4",
                        "surface-container": "#eeeeee",
                        "on-secondary": "#ffffff",
                        "secondary-fixed": "#a3f69c",
                        "tertiary": "#400007",
                        "outline": "#767683",
                        "secondary": "#1b6d24",
                        "primary": "#000666",
                        "inverse-primary": "#bdc2ff",
                        "secondary-container": "#a0f399",
                        "on-surface-variant": "#454652",
                        "primary-fixed-dim": "#bdc2ff",
                        "on-tertiary-container": "#e87575",
                        "on-surface": "#1a1c1c",
                        "surface-container-high": "#e8e8e8",
                        "inverse-on-surface": "#f1f1f1",
                        "surface-dim": "#dadada",
                        "on-secondary-fixed": "#002204",
                        "error": "#ba1a1a"
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
                        "display-lg": ["Inter"],
                        "headline-md": ["Inter"],
                        "label-sm": ["Inter"],
                        "title-lg": ["Inter"],
                        "body-base": ["Inter"]
                    },
                    "fontSize": {
                        "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                        "body-base": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
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
<body class="bg-background text-on-background pb-24 pt-16">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-200 active:scale-95">
<div class="flex items-center">
<h1 class="text-xl font-bold text-indigo-900 dark:text-indigo-100 font-['Inter'] font-semibold text-lg">Xpensify AI</h1>
</div>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center">
<img alt="User profile photo" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxahYzLEpp2ImcGFgc0CCkLe2FyxPsDCOW096Qvg1HtTiOt0Wc-G9gaoGvj11AehWVPEOiN9fEUEZ25DK0DKIZoRdHFJxvyFBhkTCc8cQ7ASksAAfKl3QyKazAGPwWDuGUJQ7qQOriRhssnHT6HjGQN80PY8xxp2ZchA4aMJyJ7yB35JmYYV8UeDk5rgaETScqLgA1RLoVd2PxClx7QaUcq1_9mybkiyIkU3nBppmN1MNixQ4yYXEa1fOwNj1X4ZNinbaYlI8HiNn7"/>
</div>
</header>
<main class="px-container-margin py-base flex flex-col gap-6">
    <!-- Greeting -->
    <div class="mt-4">
        <h2 id="greeting-text" class="font-headline-md text-headline-md text-on-background">Welcome!</h2>
        <p class="font-label-sm text-label-sm text-outline">Here is your spending overview</p>
    </div>
    <!-- Main Balance Card -->
    <section class="bg-primary text-on-primary rounded-[24px] p-6 shadow-xl relative overflow-hidden transition-all duration-300">
        <div class="relative z-10">
            <p class="font-label-sm text-label-sm opacity-80 uppercase tracking-widest mb-1">Current Expenses</p>
            <div class="flex items-baseline gap-1">
                <span class="text-2xl font-semibold opacity-90">₹</span>
                <h1 id="total-expense-main" class="text-4xl font-extrabold tracking-tight">0</h1>
            </div>
            <div class="mt-6 flex justify-between items-end">
                <div>
                    <p class="font-label-sm text-label-sm opacity-70 mb-0.5">Monthly Budget</p>
                    <p id="monthly-budget" class="font-title-lg text-lg font-semibold">₹0</p>
                </div>
                <!-- Comparison -->
                <div class="flex items-center gap-1 py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="material-symbols-outlined text-[18px]">trending_up</span>
                    <span class="font-label-sm text-xs font-semibold">0% vs last month</span>
                </div>
            </div>
        </div>
        <!-- Decorations -->
        <div class="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
    </section>

    <!-- Cash Flow -->
    <div class="grid grid-cols-2 gap-4">
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span class="material-symbols-outlined text-[18px]">south_west</span>
                </div>
                <span class="font-label-sm text-label-sm text-outline">Income</span>
            </div>
            <p id="total-income" class="font-title-lg text-xl text-on-surface">₹0</p>
        </div>
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                    <span class="material-symbols-outlined text-[18px]">north_east</span>
                </div>
                <span class="font-label-sm text-label-sm text-outline">Expense</span>
            </div>
            <p id="total-expense-small" class="font-title-lg text-xl text-on-surface">₹0</p>
        </div>
    </div>

    <section id="category-breakdown-section" class="bg-surface-container-lowest rounded-[24px] p-card-padding border border-outline-variant/30 shadow-sm">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-title-lg text-on-surface">Category Breakdown</h2>
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">This month</span>
        </div>
        <div id="category-breakdown-list" class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-center">
                <p class="font-body-base text-body-base text-on-surface">No category breakdown yet</p>
                <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Add transactions to see where your money is going.</p>
            </div>
        </div>
    </section>

    <!-- Recent Transactions -->
    <section class="mb-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-title-lg text-on-surface">Recent Activity</h2>
            <button id="show-all-history" class="text-primary font-label-sm text-label-sm">Show history</button>
        </div>
        <div id="recent-transactions-list" class="space-y-4">
            <!-- Dynamically injected -->
        </div>
    </section>
</main>

<!-- Navigation -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:hidden">
<a data-stitch-route="dashboard" class="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-2xl px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
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
