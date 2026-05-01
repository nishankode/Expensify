export const addCategory = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Xpensify AI - Add Category</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed-dim": "#ffb3b1",
                        "on-secondary": "#ffffff",
                        "on-primary-container": "#8690ee",
                        "tertiary-fixed": "#ffdad8",
                        "on-secondary-fixed-variant": "#005312",
                        "surface": "#f9f9f9",
                        "primary": "#000666",
                        "on-tertiary-fixed": "#410007",
                        "surface-tint": "#4c56af",
                        "outline-variant": "#c6c5d4",
                        "primary-fixed": "#e0e0ff",
                        "on-background": "#1a1c1c",
                        "on-primary": "#ffffff",
                        "tertiary-container": "#610f16",
                        "on-primary-fixed": "#000767",
                        "tertiary": "#400007",
                        "error": "#ba1a1a",
                        "surface-container-high": "#e8e8e8",
                        "outline": "#767683",
                        "on-error-container": "#93000a",
                        "secondary-container": "#a0f399",
                        "surface-container": "#eeeeee",
                        "secondary": "#1b6d24",
                        "on-surface-variant": "#454652",
                        "inverse-surface": "#2f3131",
                        "on-tertiary-fixed-variant": "#80272b",\r
                        "on-surface": "#1a1c1c",
                        "on-tertiary-container": "#e87575",
                        "surface-bright": "#f9f9f9",
                        "on-secondary-fixed": "#002204",
                        "inverse-on-surface": "#f1f1f1",
                        "on-error": "#ffffff",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed-dim": "#88d982",
                        "surface-container-low": "#f3f3f3",
                        "primary-fixed-dim": "#bdc2ff",
                        "primary-container": "#1a237e",
                        "inverse-primary": "#bdc2ff",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#217128",
                        "on-primary-fixed-variant": "#343d96",
                        "surface-dim": "#dadada",
                        "surface-container-highest": "#e2e2e2",
                        "surface-variant": "#e2e2e2",
                        "on-tertiary": "#ffffff",
                        "background": "#f9f9f9",
                        "secondary-fixed": "#a3f69c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gutter": "16px",
                        "card-padding": "16px",
                        "touch-target-min": "48px",
                        "base": "8px",
                        "container-margin": "20px"
                    },
                    "fontFamily": {
                        "title-lg": ["Inter"],
                        "label-sm": ["Inter"]
                    },
                }
            }
        }
    </script>
    <style>
        body { min-height: 100dvh; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-base antialiased min-h-screen flex flex-col relative selection:bg-primary-fixed selection:text-on-primary-fixed">
    <header class="bg-white/80 backdrop-blur-lg sticky top-0 w-full z-50 shadow-sm flex items-center justify-between px-5 h-16">
        <div class="flex items-center gap-3">
            <button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <h1 class="text-xl font-bold text-indigo-900 font-title-lg">Add New Category</h1>
        </div>
        <div class="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shadow-sm ring-2 ring-primary-fixed">
             <span class="material-symbols-outlined text-primary w-full h-full flex items-center justify-center">person</span>
        </div>
    </header>

    <main class="flex-1 overflow-y-auto px-container-margin py-gutter pb-[40px] flex flex-col gap-gutter">
        <section class="bg-surface-container-lowest rounded-xl shadow-sm p-card-padding flex flex-col gap-6">
            <div class="flex p-1 bg-surface-container rounded-lg">
                <button class="flex-1 py-2 px-4 rounded-md font-label-sm text-label-sm transition-all">Expense</button>
                <button class="flex-1 py-2 px-4 rounded-md font-label-sm text-label-sm transition-all">Income</button>
            </div>
            
            <div class="flex flex-col gap-2">
                <label class="font-label-sm text-label-sm text-on-surface-variant ml-1">Category Name</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">edit_square</span>
                    <input id="name-input" type="text" placeholder="e.g. Dining Out" class="w-full h-touch-target-min bg-surface-container-lowest border border-outline-variant/60 rounded-lg pl-12 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant/80 shadow-sm"/>
                </div>
            </div>
        </section>

        <section class="bg-surface-container-lowest rounded-xl shadow-sm p-card-padding flex flex-col gap-gutter">
            <label class="font-label-sm text-label-sm text-on-surface-variant ml-1">Select Icon</label>
            <div class="grid grid-cols-5 gap-3">
                <button data-icon="restaurant" class="aspect-square rounded-lg flex items-center justify-center transition-all shadow-sm">
                    <span class="material-symbols-outlined">restaurant</span>
                </button>
                <button data-icon="directions_car" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">directions_car</span>
                </button>
                <button data-icon="shopping_bag" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">shopping_bag</span>
                </button>
                <button data-icon="flight" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">flight</span>
                </button>
                <button data-icon="home" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">home</span>
                </button>
                <button data-icon="local_hospital" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">local_hospital</span>
                </button>
                <button data-icon="school" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">school</span>
                </button>
                <button data-icon="pets" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">pets</span>
                </button>
                <button data-icon="receipt_long" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">receipt_long</span>
                </button>
                <button data-icon="stadia_controller" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">stadia_controller</span>
                </button>
                <button data-icon="payments" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">payments</span>
                </button>
                <button data-icon="savings" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">savings</span>
                </button>
                <button data-icon="account_balance" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">account_balance</span>
                </button>
                <button data-icon="work" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">work</span>
                </button>
                <button data-icon="fitness_center" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">fitness_center</span>
                </button>
                <button data-icon="shopping_cart" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">shopping_cart</span>
                </button>
                <button data-icon="movie" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">movie</span>
                </button>
                <button data-icon="celebration" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">celebration</span>
                </button>
                <button data-icon="redeem" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">redeem</span>
                </button>
                <button data-icon="wifi" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">wifi</span>
                </button>
                <button data-icon="bolt" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">bolt</span>
                </button>
                <button data-icon="water_drop" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">water_drop</span>
                </button>
                <button data-icon="stroller" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">stroller</span>
                </button>
                <button data-icon="shield" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">shield</span>
                </button>
                <button data-icon="volunteer_activism" class="aspect-square rounded-lg flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">volunteer_activism</span>
                </button>
            </div>
        </section>

        <section class="bg-surface-container-lowest rounded-xl shadow-sm p-card-padding flex flex-col gap-gutter">
            <label class="font-label-sm text-label-sm text-on-surface-variant ml-1">Icon Color</label>
            <div class="flex gap-4 overflow-x-auto py-2 px-1 snap-x hide-scrollbar">
                <button data-color="#ba1a1a" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#F59E0B" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#10B981" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#3B82F6" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#8B5CF6" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#EC4899" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#14B8A6" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#1A237E" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#2E7D32" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
                <button data-color="#3949AB" class="w-11 h-11 rounded-full shrink-0 snap-center shadow-sm"></button>
            </div>
        </section>

        <button class="mt-6 w-full h-[56px] bg-primary text-on-primary rounded-full font-bold shadow-lg active:scale-95 transition-all">
            Create Category
        </button>
    </main>
</body>
</html>\`;
`
