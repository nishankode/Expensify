export const welcome = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Welcome to Xpensify AI</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        "primary": "#000666",
                        "primary-container": "#1a237e",
                        "on-primary": "#ffffff",
                        "background": "#f9f9f9",
                        "surface": "#f9f9f9",
                        "surface-container-lowest": "#ffffff",
                        "on-surface": "#1a1c1c",
                        "on-surface-variant": "#454652",
                        "outline": "#767683",
                        "outline-variant": "#c6c5d4"
                    }
                }
            }
        }
    </script>
    <style>
        body { min-height: 100dvh; overflow: hidden; }
        .gradient-bg {
            background: radial-gradient(circle at 50% 50%, #ffffff 0%, #f0f4ff 100%);
        }
        .float-animation {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body class="gradient-bg text-on-background font-body-base antialiased min-h-screen flex flex-col items-center justify-between py-12 px-8">
    <div class="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
        <div class="relative mb-8 float-animation">
            <!-- Glassmorphic Background Blur -->
            <div class="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-150"></div>
            <img src="./onboarding_welcome_illustration.png" alt="Xpensify AI Welcome" class="w-64 h-64 relative z-10 object-contain drop-shadow-2xl" 
                 onerror="this.src='https://cdn-icons-png.flaticon.com/512/3258/3258448.png'"/>
        </div>

        <h1 class="text-3xl font-extrabold text-primary tracking-tight leading-tight mb-4">
            Master Your Money with AI Intelligence
        </h1>
        <p class="text-on-surface-variant text-lg leading-relaxed mb-8">
            Your personal AI-powered financial assistant is ready to help you save more and spend smarter.
        </p>

        <div class="grid grid-cols-2 gap-4 w-full mb-12">
            <div class="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span class="material-symbols-outlined text-primary mb-2">auto_awesome</span>
                <span class="text-xs font-bold text-on-surface uppercase tracking-wider">AI Insights</span>
            </div>
            <div class="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span class="material-symbols-outlined text-primary mb-2">account_balance_wallet</span>
                <span class="text-xs font-bold text-on-surface uppercase tracking-wider">Smart Budget</span>
            </div>
        </div>
    </div>

    <button id="get-started" class="w-full max-w-sm h-16 bg-primary text-on-primary text-xl font-bold rounded-2xl shadow-[0_8px_30px_rgb(0,6,102,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
        Get Started
        <span class="material-symbols-outlined">arrow_forward</span>
    </button>

    <script>
        document.getElementById('get-started').onclick = () => {
             if(window.ReactNativeWebView) {
                 window.ReactNativeWebView.postMessage(JSON.stringify({type: 'navigate', route: 'dashboard'}));
             }
        }
    </script>
</body>
</html>`;
