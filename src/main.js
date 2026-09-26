// DesiFlix Android Application Main Script

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    initNativeControls();
    initConsoleLogs();
});

// Sample Movie & Show Data for DesiFlix
const desiflixShows = [
    {
        title: "Mirzapur Uncut",
        badge: "🔥 TOP 1",
        meta: "4K HDR • Action / Crime",
        bg: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop')"
    },
    {
        title: "The Family Agent",
        badge: "⭐ 9.2",
        meta: "HD • Thriller",
        bg: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop')"
    },
    {
        title: "Sacred Games 3",
        badge: "NEW",
        meta: "Dolby 5.1 • Drama",
        bg: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop')"
    },
    {
        title: "Delhi Crime Files",
        badge: "TRENDING",
        meta: "HD • True Crime",
        bg: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&auto=format&fit=crop')"
    }
];

function initCatalog() {
    const container = document.getElementById('catalog-list');
    if (!container) return;

    container.innerHTML = desiflixShows.map(show => `
    <div class="movie-card">
      <div class="movie-poster" style="background-image: ${show.bg};">
        <span class="movie-badge">${show.badge}</span>
      </div>
      <div class="movie-info">
        <div class="movie-title">${show.title}</div>
        <div class="movie-meta">${show.meta}</div>
      </div>
    </div>
  `).join('');
}

function initConsoleLogs() {
    const consoleBox = document.getElementById('console-output');
    if (consoleBox) {
        appendLog('info', `Node.js v24.14.1 runtime engine connected.`);
        appendLog('success', `Capacitor bridge initialized for com.desiflix.app.`);
    }
}

function appendLog(type, message) {
    const consoleBox = document.getElementById('console-output');
    if (!consoleBox) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${time}] ${message}`;

    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

function initNativeControls() {
    // Inspect Node.js Button
    document.getElementById('btn-inspect-node')?.addEventListener('click', () => {
        appendLog('info', 'Node.js details: Engine V8, Vite 5.x bundler, NPM module ecosystem.');
        alert('⚡ DesiFlix App is powered by Node.js!\n\nBuild Toolchain: Vite + Capacitor\nPackage: com.desiflix.app\nTarget: Android APK');
    });

    // Simulate APK status
    document.getElementById('btn-simulate-apk')?.addEventListener('click', () => {
        appendLog('success', 'Android APK Config validated: com.desiflix.app target Ready!');
        const section = document.getElementById('apk-instructions-section');
        section?.scrollIntoView({ behavior: 'smooth' });
    });

    // Haptic Feedback Simulation
    document.getElementById('btn-haptic')?.addEventListener('click', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
            appendLog('success', 'Vibration pulse sent to Android haptic motor (100ms).');
        } else {
            appendLog('warning', 'Haptic vibration triggered via Capacitor Haptics plugin.');
        }
    });

    // Android Toast Simulation
    document.getElementById('btn-toast')?.addEventListener('click', () => {
        appendLog('info', 'Toast Notification: "Hello World from DesiFlix Android App!"');
        showCustomToast('Hello World from DesiFlix Android App!');
    });

    // Get Device Info
    document.getElementById('btn-device')?.addEventListener('click', () => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const screenRes = `${window.innerWidth}x${window.innerHeight}`;
        appendLog('info', `Platform: ${platform} | Screen: ${screenRes} | UserAgent: ${userAgent.substring(0, 45)}...`);
    });

    // Toggle Ambient Mode
    document.getElementById('btn-theme')?.addEventListener('click', () => {
        document.body.classList.toggle('ambient-glow');
        appendLog('success', 'Toggled Android Ambient Glow theme overlay.');
    });

    // Copy build commands button
    document.getElementById('btn-copy-cmd')?.addEventListener('click', () => {
        const textToCopy = `npm run build\nnpx cap add android\nnpx cap sync android\nnpx cap open android`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            appendLog('success', 'Copied Android build commands to clipboard!');
            showCustomToast('Commands copied to clipboard!');
        }).catch(() => {
            appendLog('warning', 'Command copy failed, manual selection enabled.');
        });
    });

    // Navigation click alerts
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const label = item.querySelector('.nav-label')?.textContent;
            appendLog('info', `Navigated to screen: ${label}`);
        });
    });
}

function showCustomToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(255, 23, 68, 0.95)';
    toast.style.color = '#FFF';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '20px';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '700';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
    toast.style.zIndex = '9999';
    toast.style.animation = 'fadeIn 0.3s ease';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}
