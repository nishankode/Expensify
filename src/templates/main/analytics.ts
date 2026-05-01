export const analytics = `<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Xpensify AI - Analytics</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-200 active:scale-95">
<div class="flex items-center">
<h1 class="text-xl font-bold text-indigo-900 dark:text-indigo-100 font-['Inter'] font-semibold text-lg">Analytics</h1>
</div>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center">
<img alt="User profile photo" class="w-full h-full object-cover" data-alt="close-up portrait of a young professional with short dark hair, smiling gently against a bright background" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&amp;accessories=shades&amp;top=shortHair"/>
</div>
</header>

<main class="px-container-margin py-base flex flex-col gap-5">
<div class="flex bg-surface-container rounded-full p-1 mt-4">
<button class="analytics-toggle flex-1 text-center py-2 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-high transition-colors" data-view="weekly">Weekly</button>
<button class="analytics-toggle flex-1 text-center py-2 rounded-full font-label-sm text-label-sm bg-primary text-on-primary shadow-sm transition-colors" data-view="monthly">Monthly</button>
</div>

<section class="bg-primary text-on-primary rounded-[24px] p-6 shadow-xl relative overflow-hidden transition-all duration-300">
<div class="relative z-10">
<div class="flex items-start justify-between gap-4">
<div>
<p class="font-label-sm text-label-sm opacity-80 uppercase tracking-widest mb-1" id="period-chip">This Month</p>
<div class="flex items-baseline gap-1">
<span class="text-2xl font-semibold opacity-90">&#8377;</span>
<h2 id="total-expense" class="text-[34px] font-extrabold tracking-tight leading-none">0</h2>
</div>
</div>
<div class="rounded-full bg-white/16 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
Expense
</div>
</div>
<p id="comparison-text" class="mt-4 text-sm leading-6 text-white/80">vs last month</p>
<div class="mt-5 grid grid-cols-2 gap-3">
<div class="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm ring-1 ring-white/10">
<p class="text-[11px] uppercase tracking-[0.16em] text-white/65">Net</p>
<p id="hero-net" class="mt-1 text-lg font-semibold text-white">&#8377;0</p>
</div>
<div class="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm ring-1 ring-white/10">
<p class="text-[11px] uppercase tracking-[0.16em] text-white/65">Budget</p>
<p id="hero-budget" class="mt-1 text-lg font-semibold text-white">Not set</p>
</div>
</div>
</div>
<div class="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
<div class="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
</section>

<section class="grid grid-cols-2 gap-4">
<article class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
<div class="flex items-center gap-2 mb-2">
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span class="material-symbols-outlined text-[18px]">south_west</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Income</span>
</div>
<p id="metric-income" class="font-title-lg text-xl text-on-surface">&#8377;0</p>
</article>
<article class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
<div class="flex items-center gap-2 mb-2">
<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">account_balance</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Net Cash Flow</span>
</div>
<p id="metric-net" class="font-title-lg text-xl text-on-surface">&#8377;0</p>
<p id="metric-net-caption" class="mt-1 text-[11px] leading-4 text-on-surface-variant">Money left after expenses</p>
</article>
<article class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
<div class="flex items-center gap-2 mb-2">
<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">speed</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Budget Pulse</span>
</div>
<p id="metric-budget" class="font-title-lg text-xl text-on-surface">Not set</p>
<p id="metric-budget-caption" class="mt-1 text-[11px] leading-4 text-on-surface-variant">Set a budget to track your pace</p>
</article>
<article class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
<div class="flex items-center gap-2 mb-2">
<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">calendar_today</span>
</div>
<span class="font-label-sm text-label-sm text-outline">Avg Spend</span>
</div>
<p id="metric-average" class="font-title-lg text-xl text-on-surface">&#8377;0</p>
<p id="metric-average-caption" class="mt-1 text-[11px] leading-4 text-on-surface-variant">Average spend per day</p>
</article>
</section>

<section id="category-budget-status-section" class="bg-surface-container-lowest rounded-[24px] p-card-padding border border-outline-variant/30 shadow-sm">
<div class="flex items-center justify-between gap-3">
<h2 class="font-title-lg text-on-surface">Category Budget Status</h2>
<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">Monthly</span>
</div>
<div id="category-budget-status-list" class="mt-4 flex flex-col gap-3">
<div class="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-center">
<p class="text-sm font-semibold text-on-surface">No category budgets yet</p>
<p class="mt-1 text-[11px] leading-4 text-on-surface-variant">Set category budgets from Budget Settings to track them here.</p>
</div>
</div>
</section>

<section class="bg-surface-container-lowest rounded-[24px] p-card-padding border border-outline-variant/30 shadow-sm">
<div class="flex items-center justify-between gap-3">
<h2 class="font-title-lg text-on-surface">Quick Insights</h2>
<span class="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
</div>
<div id="insight-list" class="mt-4 flex flex-col gap-3">
<div class="rounded-2xl bg-surface-container-low p-4">
<p class="text-sm font-medium text-on-surface">Insights will appear here.</p>
</div>
</div>
</section>

<section class="grid grid-cols-1 gap-3">
<article class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
<div class="flex items-center justify-between">
<div>
<p class="font-label-sm text-label-sm text-outline">Top Category</p>
<h3 id="signal-top-name" class="mt-2 text-lg font-semibold leading-6 text-on-surface">No category data</h3>
</div>
<div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">pie_chart</span>
</div>
</div>
<p id="signal-top-amount" class="mt-3 text-xl font-bold leading-7 text-on-surface">&#8377;0</p>
<p id="signal-top-caption" class="mt-1 text-[11px] leading-4 text-on-surface-variant">Add spending to see category leaders</p>
</article>
<article class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm">
<div class="flex items-center justify-between">
<div>
<p class="font-label-sm text-label-sm text-outline">Largest Expense</p>
<h3 id="signal-largest-name" class="mt-2 text-lg font-semibold leading-6 text-on-surface">No expense recorded</h3>
</div>
<div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">receipt_long</span>
</div>
</div>
<p id="signal-largest-amount" class="mt-3 text-xl font-bold leading-7 text-on-surface">&#8377;0</p>
<p id="signal-largest-caption" class="mt-1 text-[11px] leading-4 text-on-surface-variant">Your biggest expense will appear here</p>
</article>
</section>

</main>

<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:hidden">
<a data-stitch-route="dashboard" class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-['Inter'] text-[10px] font-medium">Home</span>
</a>
<a data-stitch-route="analytics" class="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-2xl px-4 py-1 hover:text-indigo-600 dark:hover:text-indigo-300 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="analytics" style="font-variation-settings: 'FILL' 1;">analytics</span>
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
