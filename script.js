// Configuration
const API_ENDPOINTS = [
    'https://de1.api.radio-browser.info/json',
    'https://at1.api.radio-browser.info/json',
    'https://nl1.api.radio-browser.info/json',
    'https://fr1.api.radio-browser.info/json'
];
let currentApiIndex = 0;
let API_BASE = API_ENDPOINTS[currentApiIndex];
let retryCount = 0;

const DEFAULT_LIMIT = 200;
const DEFAULT_LOGO = 'logo.png';

const CUSTOM_SINGER_STATIONS = [];

// State
let currentStations = [];
let currentPlaylist = JSON.parse(localStorage.getItem('fm_playlist')) || [];
let currentStationIndex = -1;
let currentSource = 'search';
let currentMode = 'India'; // 'Global' or 'India'
let isMuted = false;
let lastVolume = 30;
let isHDEQEnabled = false;
let isDJBoostEnabled = false;
let isVolBoostEnabled = false;
let isSmartScanning = false;
let smartScanTimeout = null;
let playCheckTimeout = null;
let queueTickerInterval = null;
let showingNextInQueue = true;
let lastQuery = '';
let lastCountry = '';
let lastTag = '';
let wakeLock = null;
let consecutiveErrors = 0;

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const keepAliveAudio = document.getElementById('keep-alive-audio');
const stationsGrid = document.getElementById('stations-grid');
const playlistList = document.getElementById('playlist-list');
const searchInput = document.getElementById('station-search');
const searchBtn = document.getElementById('search-btn');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const modeToggleText = document.getElementById('mode-toggle-text');
const categoriesBar = document.getElementById('categories-bar');
const indiaCats = document.getElementById('india-cats');
const globalCats = document.getElementById('global-cats');
const catButtons = document.querySelectorAll('.cat-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeSlider = document.getElementById('volume-slider');
const playerStatus = document.getElementById('player-status');
const currentStationName = document.getElementById('current-station-name');
const currentStationMeta = document.getElementById('current-station-meta');
const currentStationImg = document.getElementById('current-station-info-img');
const addToPlaylistBtn = document.getElementById('add-to-playlist-btn');
const resultsCount = document.getElementById('results-count');
const mainLoader = document.getElementById('main-loader');
const nowPlayingCard = document.querySelector('.now-playing-card');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const refreshBtn = document.getElementById('refresh-btn');
const tabRefreshBtn = document.getElementById('tab-refresh-btn');
const fsRefreshBtn = document.getElementById('fs-refresh-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const eqHdBtn = document.getElementById('eq-hd-btn');
const djBoostBtn = document.getElementById('dj-boost-btn');
const volBoostCheck = document.getElementById('vol-boost-check');
const smartAutoScanBtn = document.getElementById('smart-auto-scan-btn');
const queueTickerText = document.getElementById('queue-ticker-text');

// New UI Elements
const mainTabs = document.querySelectorAll('.tab-btn:not(.action-btn)');
const views = {
    discovery: document.getElementById('discovery-view'),
    playlist: document.getElementById('playlist-view')
};
const quickPlaylistList = document.getElementById('quick-playlist-list');
const fullPlaylistList = document.getElementById('full-playlist-list');




// Initialize
function init() {
    setupEventListeners();
    fetchStations('', 'India'); // Initial load (Trending)
    renderPlaylist();
    updateVolume(30);
    loadTheme();
    
    // Status Badge Color Observer
    const statusObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const text = playerStatus.textContent.toLowerCase();
                
                if (text.includes('buffer') || text.includes('load') || text.includes('scan') || text.includes('tune')) {
                    playerStatus.style.color = '#eab308'; // yellow
                    playerStatus.style.background = 'rgba(234, 179, 8, 0.15)';
                    playerStatus.style.borderColor = 'rgba(234, 179, 8, 0.3)';
                    playerStatus.style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.4)';
                } else if (text.includes('play')) {
                    playerStatus.style.color = '#22c55e'; // green
                    playerStatus.style.background = 'rgba(34, 197, 94, 0.15)';
                    playerStatus.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                    playerStatus.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.4)';
                } else if (text.includes('pause') || text.includes('stop') || text.includes('error') || text.includes('fail') || text.includes('stall')) {
                    playerStatus.style.color = '#ef4444'; // red
                    playerStatus.style.background = 'rgba(239, 68, 68, 0.15)';
                    playerStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    playerStatus.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
                } else {
                    playerStatus.style.color = 'orange'; // default
                    playerStatus.style.background = 'rgba(255, 165, 0, 0.15)';
                    playerStatus.style.borderColor = 'rgba(255, 165, 0, 0.3)';
                    playerStatus.style.boxShadow = '0 0 15px rgba(255, 165, 0, 0.4)';
                }
            }
        });
    });
    statusObserver.observe(playerStatus, { childList: true, characterData: true, subtree: true });

    // Auto-adjusting helper for mobile
    window.addEventListener('resize', () => {
        lucide.createIcons();
    });
}

function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        const country = currentMode === 'India' ? 'India' : '';
        fetchStations(query, country);
        switchView('discovery');
    });

    modeToggleBtn.addEventListener('click', () => {
        searchInput.value = '';
        if (currentMode === 'India') {
            currentMode = 'Global';
            modeToggleText.textContent = 'Global';
            const icon = document.getElementById('mode-toggle-icon');
            if (icon) icon.textContent = '🌍';
            modeToggleBtn.classList.remove('india-active');
            indiaCats.style.display = 'none';
            globalCats.style.display = 'flex';
            fetchStations('', '');
        } else {
            currentMode = 'India';
            modeToggleText.textContent = 'India';
            const icon = document.getElementById('mode-toggle-icon');
            if (icon) icon.textContent = '🇮🇳';
            modeToggleBtn.classList.add('india-active');
            globalCats.style.display = 'none';
            indiaCats.style.display = 'flex';
            fetchStations('', 'India');
        }
        updateActiveCat('All');
        switchView('discovery');
    });

    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // If dragging, let the capture phase handle prevention
            const tag = btn.dataset.tag;
            const country = currentMode === 'India' ? 'India' : '';
            fetchStations('', country, tag);
            updateActiveCat(btn.textContent);
            switchView('discovery');
        });
    });

    // Drag to scroll for category bar
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    categoriesBar.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        categoriesBar.style.cursor = 'grabbing';
        startX = e.pageX - categoriesBar.offsetLeft;
        scrollLeft = categoriesBar.scrollLeft;
    });
    categoriesBar.addEventListener('mouseleave', () => {
        isDown = false;
        categoriesBar.style.cursor = 'grab';
    });
    categoriesBar.addEventListener('mouseup', () => {
        isDown = false;
        categoriesBar.style.cursor = 'grab';
    });
    categoriesBar.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - categoriesBar.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast multiplier
        if (Math.abs(walk) > 5) isDragging = true;
        categoriesBar.scrollLeft = scrollLeft - walk;
    });
    // Prevent click if dragged
    categoriesBar.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const country = currentMode === 'India' ? 'India' : '';
            fetchStations(searchInput.value.trim(), country);
            switchView('discovery');
        }
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            fetchStations(lastQuery, lastCountry, lastTag);
        });
    }

    if (tabRefreshBtn) {
        tabRefreshBtn.addEventListener('click', () => {
            fetchStations(lastQuery, lastCountry, lastTag);
        });
    }

    if (fsRefreshBtn) {
        fsRefreshBtn.addEventListener('click', () => {
            fetchStations(lastQuery, lastCountry, lastTag);
            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    const stationDetailsEl = document.querySelector('.station-details');
    if (stationDetailsEl) {
        stationDetailsEl.addEventListener('dblclick', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            // Clear text selection after double click
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        });

        // Volume drag logic
        let isDraggingVolume = false;
        let startX = 0;
        let startVolume = 0;

        const handleDragStart = (x) => {
            isDraggingVolume = true;
            startX = x;
            startVolume = parseFloat(volumeSlider.value) || 0;
            stationDetailsEl.style.cursor = 'ew-resize';
        };

        const handleDragMove = (x) => {
            if (!isDraggingVolume) return;
            const deltaX = x - startX;
            // Map horizontal movement to volume change (approx 3px = 1%)
            const volumeChange = deltaX * 0.33; 
            let newVolume = startVolume + volumeChange;
            newVolume = Math.max(0, Math.min(100, newVolume));
            updateVolume(newVolume);
        };

        const handleDragEnd = () => {
            isDraggingVolume = false;
            stationDetailsEl.style.cursor = '';
        };

        // Mouse Events
        stationDetailsEl.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Left click only
            handleDragStart(e.clientX);
        });
        document.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
        document.addEventListener('mouseup', handleDragEnd);

        // Touch Events
        stationDetailsEl.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                handleDragStart(e.touches[0].clientX);
            }
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (isDraggingVolume && e.touches.length === 1) {
                handleDragMove(e.touches[0].clientX);
            }
        }, { passive: true });
        document.addEventListener('touchend', handleDragEnd);
    }

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            document.body.classList.add('is-fullscreen');
        } else {
            document.body.classList.remove('is-fullscreen');
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

    playPauseBtn.addEventListener('click', togglePlay);
    
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);

    muteBtn.addEventListener('click', toggleMute);
    
    volumeSlider.addEventListener('input', (e) => {
        updateVolume(e.target.value);
    });

    addToPlaylistBtn.addEventListener('click', () => {
        if (currentStationIndex >= 0 && currentStations[currentStationIndex]) {
            addToPlaylist(currentStations[currentStationIndex]);
        }
    });

    currentStationImg.addEventListener('click', () => {
        addToPlaylistBtn.click();
    });

    if (eqHdBtn) {
        eqHdBtn.addEventListener('click', toggleHDEQ);
    }
    
    if (djBoostBtn) {
        djBoostBtn.addEventListener('click', toggleDJBoost);
    }
    
    if (volBoostCheck) {
        volBoostCheck.addEventListener('change', toggleVolBoost);
    }

    if (smartAutoScanBtn) {
        smartAutoScanBtn.addEventListener('click', toggleSmartAutoScan);
    }

    // Tab Switching
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            switchView(target);
        });
    });

    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowUp':
                e.preventDefault();
                let upVol = Math.min(100, parseInt(volumeSlider.value || lastVolume || 30) + 5);
                updateVolume(upVol);
                break;
            case 'ArrowDown':
                e.preventDefault();
                let downVol = Math.max(0, parseInt(volumeSlider.value || lastVolume || 30) - 5);
                updateVolume(downVol);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                playPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                playNext();
                break;
        }
    });

    // Audio Player Events
    audioPlayer.onplay = () => {
        playPauseBtn.innerHTML = '<i data-lucide="pause" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Playing';
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        requestWakeLock();
        if (keepAliveAudio) keepAliveAudio.play().catch(e => console.log('Keep-alive failed:', e));
    };

    audioPlayer.onplaying = () => {
        consecutiveErrors = 0; // Reset error count on successful play
        clearTimeout(playCheckTimeout); // Clear any buffering timeouts
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        playerStatus.textContent = 'Playing';
        
        if (isSmartScanning) {
            clearTimeout(smartScanTimeout);
            smartScanTimeout = setTimeout(() => {
                if (!isSmartScanning) return;
                currentStationIndex = (currentStationIndex + 1) % currentStations.length;
                playSmartScanStation();
            }, 8000);
        }
    };

    audioPlayer.onpause = () => {
        playPauseBtn.innerHTML = '<i data-lucide="play" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Paused';
        if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
        releaseWakeLock();
        if (keepAliveAudio) keepAliveAudio.pause();
    };

    audioPlayer.onwaiting = () => {
        playerStatus.textContent = 'Buffering...';
        // Removed aggressive auto-skip on mid-stream buffering to allow smooth play
    };

    audioPlayer.onerror = (e) => {
        console.error('Audio playback error:', e);
        consecutiveErrors++;
        
        if (consecutiveErrors < 10) {
            playerStatus.textContent = 'Stream Error - Moving to end...';
            playerStatus.style.color = 'var(--accent-color)';
            
            // Move the broken station to the end of the list
            if (currentSource === 'search' && currentStations.length > 0) {
                const broken = currentStations.splice(currentStationIndex, 1)[0];
                currentStations.push(broken);
                if (currentStationIndex >= currentStations.length - 1) {
                    currentStationIndex = 0;
                }
                renderStations(currentStations);
            } else if (currentSource === 'playlist' && currentPlaylist.length > 0) {
                const broken = currentPlaylist.splice(currentStationIndex, 1)[0];
                currentPlaylist.push(broken);
                if (currentStationIndex >= currentPlaylist.length - 1) {
                    currentStationIndex = 0;
                }
                renderPlaylist();
            }

            setTimeout(() => {
                playerStatus.style.color = 'var(--primary-color)';
                const list = currentSource === 'search' ? currentStations : currentPlaylist;
                if (list.length > 0) {
                    playStation(currentStationIndex, currentSource);
                }
            }, 1500);
        } else {
            playerStatus.textContent = 'Too many errors. Playback stopped.';
            playerStatus.style.color = 'var(--accent-color)';
            if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
            playPauseBtn.innerHTML = '<i data-lucide="play" id="play-icon"></i>';
            lucide.createIcons();
            consecutiveErrors = 0; // Reset for next manual play
        }
    };
    
    audioPlayer.onended = () => {
        console.log('Stream ended. Reconnecting...');
        // Live streams shouldn't end. If they do, attempt to reconnect rather than skip.
        audioPlayer.load();
        audioPlayer.play().catch(e => console.error('Reconnect failed', e));
    };

    audioPlayer.onloadstart = () => {
        playerStatus.textContent = 'Buffering...';
    };

    // Prevent background pausing
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audioPlayer.paused) {
            // Re-assert playback state to OS
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
        } else if (document.visibilityState === 'visible' && !audioPlayer.paused) {
            requestWakeLock();
        }
    });
}

// Custom API fetch mappings for complex categories
const fetchMappings = {
    'australia news': [ { tag: 'news', country: 'Australia' } ],
    'euro news': [ { name: 'euronews' }, { tag: 'news', language: 'english' } ],
    'bbc news': [ { name: 'bbc news' }, { name: 'bbc radio', tag: 'news' } ],
    'us news': [ { tag: 'news', country: 'United States' }, { tag: 'news', country: 'United States of America' } ],
    'world news': [ { tag: 'world news' }, { tag: 'international news' }, { tag: 'global news' } ],
    'russian news': [ { tag: 'news', country: 'Russia' }, { tag: 'news', language: 'russian' } ],
    'france news': [ { tag: 'news', country: 'France' }, { tag: 'news', language: 'french' } ],
    'pop': [ { tag: 'pop' }, { tag: 'top 40' }, { tag: 'hits' } ],
    'rock': [ { tag: 'rock' }, { tag: 'classic rock' }, { tag: 'hard rock' } ],
    'jazz': [ { tag: 'jazz' }, { tag: 'smooth jazz' } ],
    'classical': [ { tag: 'classical' }, { tag: 'symphony' } ],
    'hip hop': [ { tag: 'hip hop' }, { tag: 'rap' }, { tag: 'rnb' } ],
    'electronic': [ { tag: 'electronic' }, { tag: 'edm' }, { tag: 'techno' } ],
    'ambient': [ { tag: 'ambient' }, { tag: 'chillout' }, { tag: 'relax' } ],
    'dance music': [ { tag: 'dance' }, { tag: 'dance music' }, { tag: 'club' } ],
    'educational': [ { tag: 'educational' }, { tag: 'education' }, { tag: 'learning' } ],
    'sports': [ { tag: 'sports' }, { tag: 'sport' }, { tag: 'live sports' } ],
    'talk': [ { tag: 'talk' }, { tag: 'talk radio' }, { tag: 'speech' }, { tag: 'podcast' } ],
    'hindi': [ { tag: 'hindi', country: 'India' }, { language: 'hindi', country: 'India' }, { name: 'hindi', country: 'India' } ],
    'tamil': [ { tag: 'tamil', country: 'India' }, { language: 'tamil', country: 'India' }, { state: 'tamil nadu', country: 'India' } ],
    'kannada': [ { tag: 'kannada', country: 'India' }, { language: 'kannada', country: 'India' }, { state: 'karnataka', country: 'India' } ],
    'telugu': [ { tag: 'telugu', country: 'India' }, { language: 'telugu', country: 'India' }, { state: 'telangana', country: 'India' }, { state: 'andhra pradesh', country: 'India' } ],
    'malayalam': [ { tag: 'malayalam', country: 'India' }, { language: 'malayalam', country: 'India' }, { state: 'kerala', country: 'India' } ],
    'marathi': [ { tag: 'marathi', country: 'India' }, { language: 'marathi', country: 'India' }, { state: 'maharashtra', country: 'India' } ],
    'gujarati': [ { tag: 'gujarati', country: 'India' }, { language: 'gujarati', country: 'India' }, { state: 'gujarat', country: 'India' } ],
    'bollywood': [ { tag: 'bollywood', country: 'India' }, { tag: 'hindi', country: 'India' } ],
    'dj remix': [ { tag: 'dj remix', country: 'India' }, { tag: 'remix', country: 'India' }, { name: 'anbu fm hindi' }, { name: 'anbu fm' }, { name: 'radio deewana' }, { name: 'bollywoodandbeyond' }, { name: 'goldy blast' } ],
    'singer': [ { name: 'latamangeshkarradio' }, { name: 'kishorekumarradio' }, { name: 'Hits Of Lata Mangeshkar' }, { name: 'Rafi hit songs' }, { name: 'Mohammed Rafi' }, { name: 'Hits Of Kishor Kumar' }, { name: 'Goldy Mukesh' }, { name: 'hit of lata' }, { name: 'Mukesh Radio' }, { name: 'shreyaghosal' }, { name: 'arijitsingh' }, { name: 'Kumar Sanu' }, { name: 'Sonu Nigam' }, { name: 'Alka Yagnik' }, { name: 'Kishore Kumar' }, { name: 'Lata Mangeshkar' } ],
    'ghazal': [ { name: 'gazal radio london' } ],
    'news': [ { tag: 'news', country: 'India' }, { name: 'wion live tv' } ]
};

// API Functions
async function fetchStations(query = '', country = '', tag = '', autoPlay = false) {
    lastQuery = query;
    lastCountry = country;
    lastTag = tag;
    
    mainLoader.style.display = 'flex';
    stationsGrid.innerHTML = '';
    
    let url = `${API_BASE}/stations/search?limit=${DEFAULT_LIMIT}&order=clickcount&reverse=true&hidebroken=true`;
    if (country) {
        url += `&country=${encodeURIComponent(country)}`;
    }
    if (tag) {
        url += `&tag=${encodeURIComponent(tag)}`;
    }
    if (query) {
        url += `&name=${encodeURIComponent(query)}`;
    }

    try {
        if (tag.toLowerCase() === 'bhakti') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bhakti`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=devotional`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=hindu`).then(r => r.json()).catch(() => []);
            const p4 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=spiritual`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4] = await Promise.all([p1, p2, p3, p4]);
            const combined = [...d1, ...d2, ...d3, ...d4];
            
            // Remove duplicates based on stationuuid
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag.toLowerCase() === 'bangla') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bangla`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bengali`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&language=bengali`).then(r => r.json()).catch(() => []);
            const p5 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&state=West%20Bengal`).then(r => r.json()).catch(() => []);
            const p6 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=kolkata`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d5, d6] = await Promise.all([p1, p2, p3, p5, p6]);
            // Place Indian stations first
            const combined = [...d1, ...d2, ...d3, ...d5, ...d6];
            
            // Remove duplicates
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag.toLowerCase() === 'punjabi') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=punjabi`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&language=punjabi`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&state=Punjab`).then(r => r.json()).catch(() => []);
            const p4 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bhangra`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4] = await Promise.all([p1, p2, p3, p4]);
            const combined = [...d1, ...d2, ...d3, ...d4];
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag.toLowerCase() === 'bhojpuri') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bhojpuri`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&language=bhojpuri`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bihar`).then(r => r.json()).catch(() => []);
            const p4 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=patna`).then(r => r.json()).catch(() => []);
            const p5 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&state=Bihar`).then(r => r.json()).catch(() => []);
            const p6 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&name=bihar`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4, d5, d6] = await Promise.all([p1, p2, p3, p4, p5, p6]);
            const combined = [...d5, ...d6, ...d4, ...d3, ...d1, ...d2];
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag && fetchMappings[tag.toLowerCase()]) {
            const mappings = fetchMappings[tag.toLowerCase()];
            const promises = mappings.map(params => {
                let pUrl = `${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true`;
                if (params.tag) pUrl += `&tag=${encodeURIComponent(params.tag)}`;
                if (params.country) pUrl += `&country=${encodeURIComponent(params.country)}`;
                if (params.language) pUrl += `&language=${encodeURIComponent(params.language)}`;
                if (params.state) pUrl += `&state=${encodeURIComponent(params.state)}`;
                if (params.name) pUrl += `&name=${encodeURIComponent(params.name)}`;
                return fetch(pUrl).then(r => r.json()).catch(() => []);
            });
            
            const results = await Promise.all(promises);
            const combined = results.flat();
            
            // Remove duplicates
            let filtered = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
            
            // Apply category-specific exclusions and strict deduplication
            if (tag.toLowerCase() === 'dj remix') {
                filtered = filtered.filter(s => {
                    const name = s.name ? s.name.toLowerCase() : '';
                    return !name.includes('anbu fm kannada') && !name.includes('anbu fm malayalam');
                });
                
                // Further deduplicate by name to remove community duplicates
                filtered = filtered.filter((v,i,a) => a.findIndex(t => (t.name && v.name && t.name.trim().toLowerCase() === v.name.trim().toLowerCase())) === i);
            } else if (tag.toLowerCase() === 'news') {
                filtered = filtered.filter(s => {
                    const name = s.name ? s.name.toLowerCase().trim() : '';
                    return name !== 'wion' && !name.includes('wion am stereo 1430');
                });
            } else if (tag.toLowerCase() === 'singer') {
                // Inject custom stations for artists that do not exist natively on the radio-browser API
                filtered.unshift(...CUSTOM_SINGER_STATIONS);
            }
            
            currentStations = filtered;
        } else {
            const response = await fetch(url);
            currentStations = await response.json();
        }
        // Prepend Vividh Bharti Mumbai and Bollywood Gaane Purane for India 'All' category
        if (country === 'India' && !tag && !query) {
            const stationsToPrepend = ['vividh bharti mumbai', 'bollywood gaane purane'];
            
            for (let i = stationsToPrepend.length - 1; i >= 0; i--) {
                const stationName = stationsToPrepend[i];
                let index = currentStations.findIndex(s => s.name && s.name.trim().toLowerCase() === stationName);
                
                if (index > -1) {
                    const station = currentStations.splice(index, 1)[0];
                    currentStations.unshift(station);
                } else {
                    try {
                        const resp = await fetch(`${API_BASE}/stations/search?name=${encodeURIComponent(stationName)}&limit=1`);
                        const stations = await resp.json();
                        if (stations.length > 0) {
                            currentStations.unshift(stations[0]);
                        }
                    } catch(e) { console.error(`Failed to fetch ${stationName}`, e); }
                }
            }
            // Ensure uniqueness
            currentStations = currentStations.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        }
        
        const excludedStations = [
            "air kolhapur", "air jalandhar", "air indore", "air nagpur", 
            "air telgu", "air hydrabad a", "air jalendhar", "air alwar", 
            "air tuticorin", "air madikeri", "air mevad kandva", 
            "air satara", "air sasaram", "my radio dj", "jesus alive radio",
            "jesus radio malayalam", "hand of jesus",
            "radio mariam", "nour mariam", "mariam", "dipak"
        ];
        currentStations = currentStations.filter(station => {
            const name = station.name ? station.name.toLowerCase().trim() : '';
            return !excludedStations.some(ex => name.includes(ex));
        });

        // Ensure strictly only active/working stations are allowed
        currentStations = currentStations.filter(station => station.lastcheckok === 1);

        renderStations();
        resultsCount.textContent = `${currentStations.length} stations found`;
        
        if (currentStations.length > 0) {
            if (autoPlay) {
                playStation(0, 'search');
            } else {
                // Just set up the UI for the first station without loading the stream yet
                currentStationIndex = 0;
                updatePlayerUI(currentStations[0]);
                playerStatus.textContent = 'Ready (Paused)';
                // Remove playing class just in case
                if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
                audioPlayer.removeAttribute('src'); 
            }
        }
        
        // Reset retry count on success
        retryCount = 0;
    } catch (error) {
        console.error('Failed to fetch stations on server:', API_BASE, error);
        
        retryCount++;
        if (retryCount < API_ENDPOINTS.length) {
            currentApiIndex = (currentApiIndex + 1) % API_ENDPOINTS.length;
            API_BASE = API_ENDPOINTS[currentApiIndex];
            console.log('Retrying with new server:', API_BASE);
            await fetchStations(query, country, tag, autoPlay);
            return; // Exit current function context, let the retry handle it
        } else {
            stationsGrid.innerHTML = '<p class="error">Failed to load stations after trying all servers. Please check your internet connection.</p>';
            retryCount = 0; // Reset for next manual attempt
        }
    } finally {
        if (retryCount === 0) {
            mainLoader.style.display = 'none';
        }
    }
}

// Render Functions
function renderStations() {
    if (currentStations.length === 0) {
        stationsGrid.innerHTML = '<div class="empty-state"><p>No stations found for this search.</p></div>';
        return;
    }

    stationsGrid.innerHTML = currentStations.map((station, index) => `
        <div class="station-item" onclick="playStation(${index}, 'search', this)">
            <img src="${station.favicon || DEFAULT_LOGO}" 
                 class="list-img" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${DEFAULT_LOGO}';">
            <div class="item-info">
                <h4>${station.name}</h4>
                <p>${station.country} • ${station.tags ? station.tags.split(',').slice(0, 2).join(', ') : 'Radio'}</p>
            </div>
            <div class="item-actions">
                <button class="icon-btn" onclick="event.stopPropagation(); addToPlaylistById('${station.stationuuid}')">
                    <i data-lucide="plus-circle"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderPlaylist() {
    const playlistHTML = currentPlaylist.length === 0 
        ? `<div class="empty-state"><i data-lucide="list-music"></i><p>No stations saved yet</p></div>`
        : currentPlaylist.map((station, index) => `
            <div class="station-item" onclick="playStation(${index}, 'playlist', this)">
                <img src="${station.favicon || DEFAULT_LOGO}" 
                     class="list-img" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${DEFAULT_LOGO}';">
                <div class="item-info">
                    <h4>${station.name}</h4>
                    <p>${station.country || 'Custom Station'}</p>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick="event.stopPropagation(); removeFromPlaylist(${index})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');

    if (quickPlaylistList) quickPlaylistList.innerHTML = playlistHTML;
    if (fullPlaylistList) fullPlaylistList.innerHTML = playlistHTML;
    
    lucide.createIcons();
}

function switchView(target) {
    // Update Tabs
    mainTabs.forEach(tab => {
        if (tab.dataset.tab === target) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update Views
    Object.keys(views).forEach(key => {
        if (key === target) {
            views[key].style.display = 'block';
        } else {
            views[key].style.display = 'none';
        }
    });
}


// Playback Logic
function playStation(index, source = 'search', element = null) {
    currentSource = source;
    let station;
    if (source === 'search') {
        station = currentStations[index];
        currentStationIndex = index;
    } else {
        station = currentPlaylist[index];
    }

    if (!station) return;

    // Update Player UI
    updatePlayerUI(station);
    
    // Update Queue Info Text
    if (queueTickerText) {
        let list = source === 'search' ? currentStations : currentPlaylist;
        if (list.length > 0) {
            const pIdx = (index - 1 + list.length) % list.length;
            const nIdx = (index + 1) % list.length;
            const prevStationName = list[pIdx].name || 'Unknown';
            const nextStationName = list[nIdx].name || 'Unknown';
            const prevStationHTML = `<i data-lucide="skip-back" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i><span style="vertical-align:middle;">Prev: ${prevStationName}</span>`;
            const nextStationHTML = `<i data-lucide="skip-forward" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i><span style="vertical-align:middle;">Next: ${nextStationName}</span>`;
            
            queueTickerText.innerHTML = nextStationHTML;
            queueTickerText.className = 'queue-next';
            showingNextInQueue = true;
            lucide.createIcons();
            
            clearInterval(queueTickerInterval);
            queueTickerInterval = setInterval(() => {
                queueTickerText.style.opacity = '0';
                setTimeout(() => {
                    if (showingNextInQueue) {
                        queueTickerText.innerHTML = prevStationHTML;
                        queueTickerText.className = 'queue-prev';
                    } else {
                        queueTickerText.innerHTML = nextStationHTML;
                        queueTickerText.className = 'queue-next';
                    }
                    lucide.createIcons();
                    queueTickerText.style.opacity = '1';
                    showingNextInQueue = !showingNextInQueue;
                }, 300);
            }, 4000);
        }
    }

    // Load and Play
    audioPlayer.src = station.url_resolved || station.url;
    audioPlayer.load(); // Force immediate load sequence
    
    let autoPlayBlocked = false;
    
    audioPlayer.play().then(() => {
        // Instant UI response for "quick play" feel
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
    }).catch(e => {
        console.warn('Auto-play failed, user interaction required.', e);
        playerStatus.textContent = 'Click Play to start';
        if (e.name === 'NotAllowedError') {
            autoPlayBlocked = true;
        }
    });

    // Also update button immediately before promise resolves for instant feedback
    if (nowPlayingCard) nowPlayingCard.classList.add('playing');

    // Auto-skip logic if stream stalls or shows pause (unless user blocked auto-play)
    clearTimeout(playCheckTimeout);
    playCheckTimeout = setTimeout(() => {
        if ((audioPlayer.paused || audioPlayer.readyState < 3) && !autoPlayBlocked && !isSmartScanning) {
            console.log('Stream stalled or paused, automatically skipping to next station...');
            playerStatus.textContent = 'Stalled - Skipping...';
            setTimeout(() => playNext(), 1000);
        }
    }, 8000);

    // Background Audio Support (Media Session)
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: station.name,
            artist: station.country || 'FM Radio',
            album: station.tags || 'Internet Radio',
            artwork: [
                { src: station.favicon || DEFAULT_LOGO, sizes: '200x200', type: 'image/png' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
        
        navigator.mediaSession.playbackState = 'playing';
    }

    // Add active class
    const items = document.querySelectorAll('.station-item');
    items.forEach(item => item.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
    } else {
        if (items.length > index) {
            items[index].classList.add('active');
        }
    }
}

function updatePlayerUI(station) {
    const name = station.name || 'Unknown Station';
    const country = station.country || 'Global';
    const tags = station.tags ? station.tags.split(',').slice(0, 2).join(', ') : 'Radio';
    const img = station.favicon || DEFAULT_LOGO;

    const defaultLogo = DEFAULT_LOGO;
    const defaultMini = DEFAULT_LOGO;

    currentStationName.textContent = name;
    
    // Reset inline styles
    currentStationName.style.fontSize = '';
    
    if (name.length >= 25) {
        // Scroll right to left for very long names
        currentStationName.classList.add('marquee-name');
    } else {
        currentStationName.classList.remove('marquee-name');
        
        // Decrease font size 15% for names between 16-24 characters (scaled down by 25% for user request)
        if (name.length >= 16 && name.length <= 24) {
            currentStationName.style.fontSize = 'clamp(0.95rem, 5.1vw, 1.59rem)';
        }
    }
    
    currentStationMeta.textContent = `${country} • ${tags}`;
    
    // Set up main image with timeout and error fallback
    let mainImgLoaded = false;
    currentStationImg.onload = () => { mainImgLoaded = true; };
    currentStationImg.onerror = () => { currentStationImg.src = defaultLogo; };
    currentStationImg.src = img;
    setTimeout(() => {
        if (!mainImgLoaded && currentStationImg.src === img) {
            currentStationImg.src = defaultLogo;
        }
    }, 2500); // 2.5 seconds timeout
    
    playerStatus.textContent = 'Loading...';
}

function togglePlay() {
    if (audioPlayer.paused) {
        if (!audioPlayer.getAttribute('src') && currentStations.length > 0) {
            playStation(currentStationIndex >= 0 ? currentStationIndex : 0, 'search');
        } else if (!audioPlayer.getAttribute('src') && currentPlaylist.length > 0) {
            playStation(currentStationIndex >= 0 ? currentStationIndex : 0, 'playlist');
        } else {
            // Force a fresh connection to the live edge when resuming, avoiding stale buffer delays
            audioPlayer.load();
            audioPlayer.play().catch(e => console.warn('Play failed', e));
            if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        }
    } else {
        audioPlayer.pause();
    }
    // Double check icon (already handled by event listeners, but for responsiveness)
    setTimeout(() => {
        const iconName = audioPlayer.paused ? 'play' : 'pause';
        playPauseBtn.innerHTML = `<i data-lucide="${iconName}" id="play-icon"></i>`;
        lucide.createIcons();
    }, 50);
}

function playNext() {
    let list = currentSource === 'search' ? currentStations : currentPlaylist;
    if (list.length === 0) return;
    currentStationIndex = (currentStationIndex + 1) % list.length;
    playStation(currentStationIndex, currentSource);
}

function playPrevious() {
    let list = currentSource === 'search' ? currentStations : currentPlaylist;
    if (list.length === 0) return;
    currentStationIndex = (currentStationIndex - 1 + list.length) % list.length;
    playStation(currentStationIndex, currentSource);
}

// Volume Controls
function updateVolume(value) {
    let volume = value / 100;
    volumeSlider.value = value;
    
    // Apply Boosts based on active features
    if (isVolBoostEnabled) {
        volume = 1.0;
    } else {
        if (isHDEQEnabled) volume = Math.min(1.0, volume * 1.25);
        if (isDJBoostEnabled) volume = Math.min(1.0, volume * 1.5);
    }
    
    audioPlayer.volume = volume;
    
    let volIconName = 'volume-2';
    if (volume === 0) {
        volIconName = 'volume-x';
    } else if (volume < 0.5) {
        volIconName = 'volume-1';
    }
    
    const muteBtnElement = document.getElementById('mute-btn');
    if (muteBtnElement) {
        muteBtnElement.innerHTML = `<i data-lucide="${volIconName}" id="volume-icon"></i>`;
        lucide.createIcons();
    }
    
    if (volume > 0) {
        lastVolume = value;
        isMuted = false;
    }
}

function toggleMute() {
    if (isMuted) {
        updateVolume(lastVolume);
    } else {
        lastVolume = volumeSlider.value;
        updateVolume(0);
        isMuted = true;
    }
}

// Playlist Logic
function addToPlaylist(station) {
    if (currentPlaylist.some(s => s.stationuuid === station.stationuuid)) {
        alert('Station already in playlist!');
        return;
    }
    currentPlaylist.push(station);
    savePlaylist();
    renderPlaylist();
}

function addToPlaylistById(uuid) {
    const station = currentStations.find(s => s.stationuuid === uuid);
    if (station) {
        addToPlaylist(station);
    }
}

function removeFromPlaylist(index) {
    currentPlaylist.splice(index, 1);
    
    if (currentSource === 'playlist') {
        if (currentStationIndex === index) {
            currentStationIndex = -1; // Removed currently playing station
        } else if (currentStationIndex > index) {
            currentStationIndex--; // Shift index back
        }
    }
    
    savePlaylist();
    renderPlaylist();
}

function savePlaylist() {
    localStorage.setItem('fm_playlist', JSON.stringify(currentPlaylist));
}

function updateActiveCat(label) {
    catButtons.forEach(btn => {
        if (btn.textContent === label) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Theme Functions
function toggleTheme() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('fm_theme', theme);
    
    if (theme === 'light') {
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('fm_theme') || 'dark';
    setTheme(savedTheme);
}

// HD/EQ Logic
function toggleHDEQ() {
    isHDEQEnabled = !isHDEQEnabled;
    if (isHDEQEnabled) {
        eqHdBtn.style.backgroundColor = 'var(--primary-color)';
        eqHdBtn.style.color = '#fff';
        playerStatus.textContent = 'HD/EQ Active';
    } else {
        eqHdBtn.style.backgroundColor = 'transparent';
        eqHdBtn.style.color = 'inherit';
        playerStatus.textContent = 'HD/EQ Disabled';
    }
    
    updateVolume(volumeSlider.value);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// DJ Boost Logic
function toggleDJBoost() {
    isDJBoostEnabled = !isDJBoostEnabled;
    if (isDJBoostEnabled) {
        djBoostBtn.style.backgroundColor = 'var(--accent-color)';
        djBoostBtn.style.color = '#fff';
        playerStatus.textContent = 'DJ/Beats Boost ON';
    } else {
        djBoostBtn.style.backgroundColor = 'transparent';
        djBoostBtn.style.color = 'inherit';
        playerStatus.textContent = 'DJ/Beats Boost OFF';
    }
    
    updateVolume(volumeSlider.value);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// Vol Boost Logic
function toggleVolBoost(e) {
    isVolBoostEnabled = e.target.checked;
    if (isVolBoostEnabled) {
        playerStatus.textContent = 'Volume Max Boost ON';
    } else {
        playerStatus.textContent = 'Volume Boost OFF';
    }
    
    updateVolume(volumeSlider.value);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// Smart Auto Scan Logic
function toggleSmartAutoScan() {
    isSmartScanning = !isSmartScanning;
    
    if (isSmartScanning) {
        smartAutoScanBtn.innerHTML = '<i data-lucide="stop-circle"></i><span>Stop Scan</span>';
        smartAutoScanBtn.style.backgroundColor = 'var(--accent-color)';
        smartAutoScanBtn.style.color = '#fff';
        lucide.createIcons();
        
        if (currentStations.length === 0) {
            alert('No stations in the current list to scan!');
            toggleSmartAutoScan();
            return;
        }
        
        if (currentStationIndex < 0) currentStationIndex = 0;
        
        playerStatus.textContent = 'Auto Scan Started...';
        playSmartScanStation();
    } else {
        smartAutoScanBtn.innerHTML = '<i data-lucide="zap"></i><span>Auto Scan</span>';
        smartAutoScanBtn.style.backgroundColor = '';
        smartAutoScanBtn.style.color = 'var(--primary-color)';
        lucide.createIcons();
        
        clearTimeout(smartScanTimeout);
        clearTimeout(playCheckTimeout);
        playerStatus.textContent = 'Auto Scan Stopped';
    }
}

function playSmartScanStation() {
    if (!isSmartScanning) return;
    
    playStation(currentStationIndex, 'search');
    
    clearTimeout(playCheckTimeout);
    clearTimeout(smartScanTimeout);
    
    // Check if station plays within 6 seconds
    playCheckTimeout = setTimeout(() => {
        if (!isSmartScanning) return;
        
        if (audioPlayer.paused || audioPlayer.readyState < 3) {
            // Failed or taking too long
            playerStatus.textContent = 'Skipping unresponsive station...';
            currentStationIndex = (currentStationIndex + 1) % currentStations.length;
            playSmartScanStation();
        }
    }, 6000);
}

// Start App
init();

// --- Wake Lock Logic ---
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock was released');
            });
            console.log('Wake Lock is active');
        }
    } catch (err) {
        console.error(`Wake Lock error: ${err.name}, ${err.message}`);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release().catch(console.error);
        wakeLock = null;
        console.log('Wake Lock released manually');
    }
}

// --- Dynamic Visualizer Logic ---
const eqBarsList = document.querySelectorAll('.eq-bar');
let barValues = new Array(12).fill(10);
let barTargets = new Array(12).fill(10);

function updateVisualizer() {
    // Determine if audio is actively playing
    const isPlaying = !audioPlayer.paused && audioPlayer.readyState >= 3;
    const vol = audioPlayer.muted ? 0 : audioPlayer.volume;
    const volScale = (vol * 0.8) + 0.2; // Keep some movement even at low volume

    if (isPlaying) {
        // Randomly generate new height targets for a realistic look
        if (Math.random() > 0.4) {
            for (let i = 0; i < 12; i++) {
                // Creates a bell-like curve (mids bounce higher than edges)
                const eqCurve = 1 - Math.abs(i - 5.5) / 7; 
                const rawBounce = Math.random() * 85; // 0 to 85% extra height
                
                // Add some temporal randomness to simulate actual frequencies
                barTargets[i] = 15 + (rawBounce * eqCurve * volScale);
            }
        }
    } else {
        // Flatline to base height if paused/stopped
        for (let i = 0; i < 12; i++) {
            barTargets[i] = 10;
        }
    }

    // Smooth transition physics
    for (let i = 0; i < 12; i++) {
        // Easing factor (0.3) for smooth, fluid motion
        barValues[i] += (barTargets[i] - barValues[i]) * 0.3; 
        
        if (eqBarsList[i]) {
            eqBarsList[i].style.height = `${barValues[i]}%`;
        }
    }

    requestAnimationFrame(updateVisualizer);
}

// Start visualizer loop
requestAnimationFrame(updateVisualizer);
