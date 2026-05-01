export const categoryPopup = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Smart Categorization</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        "primary": "#000666",
                        "error": "#ba1a1a",
                        "background": "#f9f9f9",
                        "surface": "#f9f9f9",
                        "surface-container-lowest": "#ffffff",
                        "on-surface": "#1a1c1c",
                        "on-surface-variant": "#454652"
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-black/40 backdrop-blur-sm min-h-screen flex items-end justify-center p-4">
    <div class="w-full max-w-sm bg-surface-container-lowest rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div class="flex justify-between items-start mb-6">
            <div class="bg-primary/5 p-2 rounded-xl">
                <span class="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <button class="p-1 text-on-surface-variant" onclick="window.__stitchPost({type:'back'})">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div class="mb-8">
            <h2 class="text-2xl font-bold text-on-background leading-tight">Smart Categorization</h2>
            <p class="text-sm text-on-surface-variant mt-2">Where should we put this transaction?</p>
        </div>

        <div class="grid grid-cols-4 gap-4" id="category-choices">
            <!-- Categorization buttons -->
        </div>

        <div class="mt-8 flex gap-3">
            <button class="flex-1 h-14 border border-outline-variant rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors" onclick="window.__stitchPost({type:'back'})">Skip</button>
            <button class="flex-1 h-14 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all">Confirm</button>
        </div>
    </div>
</body>
</html>`;
