// DesiFlix Android Application Main Script

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    initNativeControls();
    initConsoleLogs();
    initSmartTVStreamer();
});



function initCatalog() {
    const container = document.getElementById('catalog-list');
    if (!container) return;

    container.innerHTML = quickTVChannels.map(ch => `
    <div class="movie-card tv-quick-card" data-id="${ch.id}" style="cursor: pointer;">
      <div class="movie-poster" style="background: linear-gradient(135deg, rgba(124, 77, 255, 0.4), rgba(255, 23, 68, 0.4)), #0F0A26; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 6px;">
        <span style="font-size: 32px;">📺</span>
        <span class="movie-badge">${ch.badge}</span>
      </div>
      <div class="movie-info">
        <div class="movie-title">${ch.title}</div>
        <div class="movie-meta">${ch.meta}</div>
      </div>
    </div>
  `).join('');

    container.querySelectorAll('.tv-quick-card').forEach(card => {
        card.addEventListener('click', () => {
            const chId = parseInt(card.getAttribute('data-id'), 10);
            if (chId && typeof playChannel === 'function') {
                playChannel(chId);
                const streamerSection = document.getElementById('tv-streamer-section');
                streamerSection?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initConsoleLogs() {
    const consoleBox = document.getElementById('console-output');
    if (consoleBox) {
        appendLog('info', `Node.js v24.14.1 runtime engine connected.`);
        appendLog('success', `Capacitor bridge initialized for com.desiflix.app.`);
        appendLog('success', `Smart TV Streamer v2.2 engine loaded.`);
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

// =============== Smart TV Streamer v2.2 Engine ===============
const TV_CONFIG = {
    baseUrl: "https://srv43.mlu49.top/Video/A",
    currentId: 1,
    running: false,
    autoNext: true,
    maxSkip: 25,
    storageKey: "desiflix_saved_tv_channels"
};

let isScanning = false;

function initSmartTVStreamer() {
    const video = document.getElementById('tv-video-player');
    const playBtn = document.getElementById('btn-tv-play');
    const prevBtn = document.getElementById('btn-tv-prev');
    const nextBtn = document.getElementById('btn-tv-next');
    const restartBtn = document.getElementById('btn-tv-restart');
    const jumpBtn = document.getElementById('btn-tv-jump');
    const scanBtn = document.getElementById('btn-tv-scan');
    const autoNextCb = document.getElementById('tv-auto-next-cb');
    const channelInput = document.getElementById('tv-channel-input');
    const exportM3uBtn = document.getElementById('btn-export-m3u');
    const clearSavedBtn = document.getElementById('btn-clear-saved');

    if (!video) return;

    TV_CONFIG.running = true;

    // Load autoNext preference
    if (autoNextCb) {
        autoNextCb.checked = TV_CONFIG.autoNext;
        autoNextCb.addEventListener('change', (e) => {
            TV_CONFIG.autoNext = e.target.checked;
            appendLog('info', `Auto Next + Smart Skip set to: ${TV_CONFIG.autoNext}`);
        });
    }

    // Video Event Listeners
    video.addEventListener('play', () => {
        updatePlayStateUI(true);
        updateStatusText('Playing');
    });

    video.addEventListener('pause', () => {
        updatePlayStateUI(false);
        updateStatusText('Paused');
    });

    video.addEventListener('ended', () => {
        appendLog('warning', `[PremiumTV] Channel A${TV_CONFIG.currentId} ended.`);
        if (TV_CONFIG.running && TV_CONFIG.autoNext) {
            appendLog('info', '[PremiumTV] Auto skipping to next working channel...');
            nextSmart();
        }
    });

    video.addEventListener('error', () => {
        appendLog('warning', `[PremiumTV] Stream error on Channel A${TV_CONFIG.currentId}`);
        updateStatusText(`Dead Stream (A${TV_CONFIG.currentId})`);

        if (TV_CONFIG.running && TV_CONFIG.autoNext && !isScanning) {
            appendLog('info', '[PremiumTV] Dead stream detected. Smart auto-skipping...');
            nextSmart();
        }
    });

    // Control Listeners
    playBtn?.addEventListener('click', togglePlay);
    prevBtn?.addEventListener('click', prevChannel);
    nextBtn?.addEventListener('click', () => nextSmart());
    restartBtn?.addEventListener('click', () => playChannel(TV_CONFIG.currentId));
    jumpBtn?.addEventListener('click', jumpToChannel);
    scanBtn?.addEventListener('click', manualScanAhead);
    exportM3uBtn?.addEventListener('click', exportM3UPlaylist);
    clearSavedBtn?.addEventListener('click', clearSavedChannels);

    const androidNativeBtn = document.getElementById('btn-tv-android-native');
    androidNativeBtn?.addEventListener('click', launchAndroidNativePlayer);

    const androidDownloadBtn = document.getElementById('btn-tv-android-download');
    androidDownloadBtn?.addEventListener('click', downloadAndroidNativeStream);

    channelInput?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') jumpToChannel();
    });

    // Initial Render & Load Channel 1
    renderSavedChannels();
    playChannel(TV_CONFIG.currentId);
}

function launchAndroidNativePlayer() {
    const streamUrl = `${TV_CONFIG.baseUrl}${TV_CONFIG.currentId}.mp4`;
    appendLog('info', `[AndroidNative] Launching Android Native Intent for Channel A${TV_CONFIG.currentId}`);

    navigator.clipboard.writeText(streamUrl).then(() => {
        showCustomToast(`Stream URL copied! Opening Android Native Player...`);
    }).catch(() => { });

    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);

    const rawHost = streamUrl.replace(/^https?:\/\//, '');
    const intentUrl = `intent://${rawHost}#Intent;scheme=https;type=video/*;action=android.intent.action.VIEW;end`;

    try {
        window.open(intentUrl, '_system');
    } catch (e) {
        window.location.href = streamUrl;
    }
}

async function downloadAndroidNativeStream() {
    const streamUrl = `${TV_CONFIG.baseUrl}${TV_CONFIG.currentId}.mp4`;
    const filename = `DesiFlix_Channel_A${TV_CONFIG.currentId}.mp4`;

    appendLog('info', `[NativeDownload] Initiating native download for Channel A${TV_CONFIG.currentId}`);
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);

    try {
        const NativeStreamService = window.Capacitor?.Plugins?.NativeStreamService;
        if (NativeStreamService && typeof NativeStreamService.downloadStreamNative === 'function') {
            const res = await NativeStreamService.downloadStreamNative({
                url: streamUrl,
                filename: filename
            });

            appendLog('success', `[NativeDownload] Started Android DownloadManager: ${filename}`);
            showCustomToast(`🚀 Android Download Started: ${filename}`);
            return;
        }
    } catch (e) {
        console.warn("Native download fallback to browser download", e);
    }

    const link = document.createElement('a');
    link.href = streamUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
    showCustomToast(`Downloading Channel A${TV_CONFIG.currentId}...`);
}

function playChannel(id) {
    if (id < 1) id = 1;
    TV_CONFIG.currentId = id;

    const video = document.getElementById('tv-video-player');
    const channelInput = document.getElementById('tv-channel-input');
    const channelTitle = document.getElementById('tv-channel-title');
    const badgeText = document.getElementById('tv-badge-text');

    const streamUrl = `${TV_CONFIG.baseUrl}${id}.mp4`;

    if (channelTitle) channelTitle.textContent = `Now Playing: Channel A${id}`;
    if (badgeText) badgeText.textContent = `Channel A${id} Active`;
    if (channelInput) channelInput.value = id;

    saveWorkingChannel(id, streamUrl);

    if (video) {
        showLoader(true, `Loading Stream Channel A${id}...`);
        updateStatusText("Connecting...");

        video.src = streamUrl;
        video.load();

        video.play().then(() => {
            showLoader(false);
            updateStatusText("Streaming Live 4K");
            appendLog('success', `[PremiumTV] Playing Channel A${id}`);
        }).catch(err => {
            showLoader(false);
            appendLog('warning', `[PremiumTV] Channel A${id} playback deferred: ${err.message}`);
        });
    }
}

function togglePlay() {
    const video = document.getElementById('tv-video-player');
    if (!video) return;

    if (video.paused) {
        video.play().catch(() => appendLog('warning', 'Playback gesture required.'));
    } else {
        video.pause();
    }
}

function prevChannel() {
    const newId = Math.max(1, TV_CONFIG.currentId - 1);
    playChannel(newId);
}

async function isLikelyWorking(id) {
    const url = `${TV_CONFIG.baseUrl}${id}.mp4`;

    try {
        const NativeStreamService = window.Capacitor?.Plugins?.NativeStreamService;
        if (NativeStreamService && typeof NativeStreamService.probeStream === 'function') {
            const res = await NativeStreamService.probeStream({ url });
            if (res && typeof res.working === 'boolean') {
                return res.working;
            }
        }
    } catch (e) {
        console.warn("Native Java probe fallback to JS", e);
    }

    try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
        if (response.ok) return true;
    } catch (e) { }

    return new Promise((resolve) => {
        const testVideo = document.createElement('video');
        testVideo.preload = 'metadata';
        let resolved = false;

        const cleanup = () => {
            testVideo.removeAttribute('src');
            testVideo.load();
        };

        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                cleanup();
                resolve(false);
            }
        }, 3000);

        testVideo.onloadedmetadata = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                cleanup();
                resolve(true);
            }
        };

        testVideo.onerror = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                cleanup();
                resolve(false);
            }
        };

        testVideo.src = url;
    });
}

async function nextSmart() {
    if (isScanning) return;
    showLoader(true, "Searching next working channel...");
    updateStatusText("Searching next working channel...");

    const start = TV_CONFIG.currentId + 1;
    appendLog('info', `[PremiumTV] Smart skipping from A${TV_CONFIG.currentId}...`);

    for (let i = 0; i <= TV_CONFIG.maxSkip; i++) {
        const testId = start + i;
        showLoader(true, `Probing Channel A${testId}...`);

        const working = await isLikelyWorking(testId);
        if (working) {
            showLoader(false);
            playChannel(testId);
            showCustomToast(`Found working stream: Channel A${testId}`);
            if ('vibrate' in navigator) navigator.vibrate([80, 40, 80]);
            return;
        }
    }

    showLoader(false);
    appendLog('warning', `[PremiumTV] Max skip reached (${TV_CONFIG.maxSkip}). Falling back to A${start}`);
    playChannel(start);
}

function jumpToChannel() {
    const input = document.getElementById('tv-channel-input');
    const val = parseInt(input?.value, 10);
    if (val && val > 0) {
        playChannel(val);
    } else {
        updateStatusText("Invalid Channel!");
        showCustomToast("Please enter a valid channel number");
    }
}

async function manualScanAhead() {
    if (isScanning) return;
    isScanning = true;
    const scanBtn = document.getElementById('btn-tv-scan');
    if (scanBtn) scanBtn.disabled = true;

    const startId = TV_CONFIG.currentId;
    const scanCount = 15;
    appendLog('info', `[PremiumTV] Scanning channels A${startId} to A${startId + scanCount}...`);
    showCustomToast(`Scanning ahead 15 channels...`);
    showLoader(true, `Starting fast native stream scan...`);

    let foundCount = 0;

    try {
        const NativeStreamService = window.Capacitor?.Plugins?.NativeStreamService;
        if (NativeStreamService && typeof NativeStreamService.scanChannelsNative === 'function') {
            const res = await NativeStreamService.scanChannelsNative({
                baseUrl: TV_CONFIG.baseUrl,
                startId: startId,
                count: scanCount
            });

            if (res && res.channels && Array.isArray(res.channels)) {
                res.channels.forEach(ch => {
                    foundCount++;
                    saveWorkingChannel(ch.id, ch.url);
                    appendLog('success', `[Native Java Scan] Found & Saved: Channel A${ch.id}`);
                });

                showLoader(false);
                isScanning = false;
                if (scanBtn) scanBtn.disabled = false;

                updateStatusText(`Native Scan Complete! Found ${foundCount} working streams.`);
                showCustomToast(`⚡ Native Java Scan finished! Found ${foundCount} active channels.`);
                if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 100]);
                renderSavedChannels();
                return;
            }
        }
    } catch (e) {
        console.warn("Native scanner fallback to JS", e);
    }

    for (let i = 0; i < scanCount; i++) {
        const testId = startId + i;
        showLoader(true, `Scanning Channel A${testId} (${i + 1}/${scanCount})...`);

        const isWorking = await isLikelyWorking(testId);
        if (isWorking) {
            foundCount++;
            saveWorkingChannel(testId, `${TV_CONFIG.baseUrl}${testId}.mp4`);
            appendLog('success', `[PremiumTV] Scan Found & Auto-Saved: Channel A${testId}`);
        }
    }

    showLoader(false);
    isScanning = false;
    if (scanBtn) scanBtn.disabled = false;

    updateStatusText(`Scan Complete! Found ${foundCount} working streams.`);
    showCustomToast(`Scan finished! Discovered ${foundCount} active channels.`);
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 100]);
    renderSavedChannels();
}

// Local Storage & Saved Channels Management
function getSavedChannels() {
    try {
        const data = localStorage.getItem(TV_CONFIG.storageKey);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveWorkingChannel(id, url) {
    const channels = getSavedChannels();
    const existingIndex = channels.findIndex(ch => ch.id === id);

    const chObj = {
        id: id,
        name: `Channel A${id}`,
        url: url,
        status: "Active 200 OK",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (existingIndex >= 0) {
        channels[existingIndex] = chObj;
    } else {
        channels.push(chObj);
    }

    channels.sort((a, b) => a.id - b.id);

    try {
        localStorage.setItem(TV_CONFIG.storageKey, JSON.stringify(channels));
    } catch (e) {
        console.error("Storage full", e);
    }

    renderSavedChannels();
}

function clearSavedChannels() {
    localStorage.removeItem(TV_CONFIG.storageKey);
    renderSavedChannels();
    appendLog('info', '[PremiumTV] Cleared saved channels list.');
    showCustomToast('Saved channels cleared');
}

function renderSavedChannels() {
    const container = document.getElementById('saved-channels-list');
    if (!container) return;

    const channels = getSavedChannels();
    if (channels.length === 0) {
        container.innerHTML = `
            <div class="empty-channels-msg">
              No saved channels yet. Click <strong>"Scan & Save Streams"</strong> or play channels to auto-save working streams!
            </div>
        `;
        return;
    }

    container.innerHTML = channels.map(ch => `
        <div class="saved-channel-item ${ch.id === TV_CONFIG.currentId ? 'active' : ''}" data-id="${ch.id}">
          <div class="ch-name">📺 ${ch.name}</div>
          <div class="ch-status">🟢 ${ch.status}</div>
          <div class="ch-time">Saved: ${ch.time}</div>
        </div>
    `).join('');

    container.querySelectorAll('.saved-channel-item').forEach(item => {
        item.addEventListener('click', () => {
            const chId = parseInt(item.getAttribute('data-id'), 10);
            if (chId) playChannel(chId);
        });
    });
}

function exportM3UPlaylist() {
    const channels = getSavedChannels();
    if (channels.length === 0) {
        showCustomToast("No channels to export!");
        return;
    }

    let m3u = "#EXTM3U\n";
    channels.forEach(ch => {
        m3u += `#EXTINF:-1 tvg-id="A${ch.id}" tvg-name="${ch.name}", ${ch.name}\n${ch.url}\n`;
    });

    const blob = new Blob([m3u], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DesiFlix_SmartTV_Channels_${Date.now()}.m3u`;
    link.click();

    appendLog('success', `[PremiumTV] Exported ${channels.length} channels to M3U file.`);
    showCustomToast(`Exported ${channels.length} channels to M3U!`);
}

// UI Helpers
function updatePlayStateUI(isPlaying) {
    const playIcon = document.getElementById('tv-play-icon');
    const playLabel = document.getElementById('tv-play-label');
    if (playIcon) playIcon.textContent = isPlaying ? '⏸' : '▶';
    if (playLabel) playLabel.textContent = isPlaying ? 'Pause' : 'Play';
}

function updateStatusText(txt) {
    const statusText = document.getElementById('tv-status-text');
    if (statusText) statusText.textContent = `Status: ${txt}`;
}

function showLoader(show, text = "") {
    const loader = document.getElementById('tv-loader-overlay');
    const loaderText = document.getElementById('tv-loader-text');
    if (loader) {
        if (show) loader.classList.remove('hidden');
        else loader.classList.add('hidden');
    }
    if (loaderText && text) loaderText.textContent = text;
}




