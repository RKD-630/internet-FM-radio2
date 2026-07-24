// Configuration
const API_BASE = 'https://de1.api.radio-browser.info/json';
const DEFAULT_LIMIT = 50;
const DEFAULT_LOGO = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%93%BB%3C%2Ftext%3E%3C%2Fsvg%3E';

// State
let currentStations = [];
let currentPlaylist = JSON.parse(localStorage.getItem('fm_playlist')) || [];
let currentStationIndex = -1;
let currentMode = 'India'; // 'Global' or 'India'
let isMuted = false;
let lastVolume = 80;
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

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
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
    playlist: document.getElementById('playlist-view'),
    scanner: document.getElementById('scanner-view')
};
const quickPlaylistList = document.getElementById('quick-playlist-list');
const fullPlaylistList = document.getElementById('full-playlist-list');

// Scanner Elements
const freqSlider = document.getElementById('freq-slider');
const freqValue = document.getElementById('freq-value');
const scanLine = document.getElementById('scan-line');
const customNameInput = document.getElementById('custom-name');
const customUrlInput = document.getElementById('custom-url');
const customIconInput = document.getElementById('custom-icon');
const addCustomBtn = document.getElementById('add-custom-btn');
const autoScanBtn = document.getElementById('auto-scan-btn');
const saveAllBtn = document.getElementById('save-all-btn');
const signalBars = document.querySelectorAll('.signal-bars span');

let discoveredFrequencies = [];

// Initialize
function init() {
    setupEventListeners();
    fetchStations('', 'India'); // Initial load (Trending)
    renderPlaylist();
    updateVolume(80);
    loadTheme();
    
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
            modeToggleText.textContent = 'Mode: Global';
            modeToggleBtn.classList.remove('india-active');
            indiaCats.style.display = 'none';
            globalCats.style.display = 'flex';
            fetchStations('', '');
        } else {
            currentMode = 'India';
            modeToggleText.textContent = 'Mode: India';
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
            fetchStations(searchInput.value.trim());
            switchView('discovery');
        }
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            fetchStations(lastQuery, lastCountry, lastTag);
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

    // Scanner Logic
    if (freqSlider) {
        freqSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value).toFixed(1);
            freqValue.textContent = val;
            updateSignalStrength(val);
        });
    }

    if (addCustomBtn) {
        addCustomBtn.addEventListener('click', addCustomStation);
    }

    if (autoScanBtn) {
        autoScanBtn.addEventListener('click', startAutoScan);
    }

    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllDiscovered);
    }

    // Audio Player Events
    audioPlayer.onplay = () => {
        playPauseBtn.innerHTML = '<i data-lucide="pause" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Playing';
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
    };

    audioPlayer.onplaying = () => {
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        playerStatus.textContent = 'Playing';
    };

    audioPlayer.onpause = () => {
        playPauseBtn.innerHTML = '<i data-lucide="play" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Paused';
        if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    };

    audioPlayer.onwaiting = () => {
        playerStatus.textContent = 'Buffering...';
    };

    audioPlayer.onerror = (e) => {
        console.error('Audio playback error:', e);
        playerStatus.textContent = 'Error Loading Stream';
        playerStatus.style.color = 'var(--accent-color)';
        setTimeout(() => {
            playerStatus.style.color = 'var(--primary-color)';
        }, 3000);
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
    'talk': [ { tag: 'talk' }, { tag: 'talk radio' }, { tag: 'speech' }, { tag: 'podcast' } ]
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
            const p1 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bhakti`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=devotional`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=hindu`).then(r => r.json()).catch(() => []);
            const p4 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=spiritual`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4] = await Promise.all([p1, p2, p3, p4]);
            const combined = [...d1, ...d2, ...d3, ...d4];
            
            // Remove duplicates based on stationuuid
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag.toLowerCase() === 'bangla') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bangla`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bengali`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&language=bengali`).then(r => r.json()).catch(() => []);
            const p5 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&state=West%20Bengal`).then(r => r.json()).catch(() => []);
            const p6 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=kolkata`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d5, d6] = await Promise.all([p1, p2, p3, p5, p6]);
            // Place Indian stations first
            const combined = [...d1, ...d2, ...d3, ...d5, ...d6];
            
            // Remove duplicates
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag.toLowerCase() === 'punjabi') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=punjabi`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&language=punjabi`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&state=Punjab`).then(r => r.json()).catch(() => []);
            const p4 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bhangra`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4] = await Promise.all([p1, p2, p3, p4]);
            const combined = [...d1, ...d2, ...d3, ...d4];
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag.toLowerCase() === 'bhojpuri') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bhojpuri`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&language=bhojpuri`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bihar`).then(r => r.json()).catch(() => []);
            const p4 = fetch(`${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true&country=India&tag=patna`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4] = await Promise.all([p1, p2, p3, p4]);
            const combined = [...d1, ...d2, ...d3, ...d4];
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else if (tag && fetchMappings[tag.toLowerCase()]) {
            const mappings = fetchMappings[tag.toLowerCase()];
            const promises = mappings.map(params => {
                let pUrl = `${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&hidebroken=true`;
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
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
        } else {
            const response = await fetch(url);
            currentStations = await response.json();
        }
        
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
    } catch (error) {
        console.error('Failed to fetch stations:', error);
        stationsGrid.innerHTML = '<p class="error">Failed to load stations. Please check your internet connection.</p>';
    } finally {
        mainLoader.style.display = 'none';
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

function updateSignalStrength(freq) {
    // Simulate signal strength based on frequency (just for UI)
    const seed = Math.sin(freq * 10);
    signalBars.forEach((bar, i) => {
        const height = 10 + (i * 10) + (seed * 5);
        bar.style.height = `${Math.max(5, height)}px`;
        bar.style.opacity = seed > 0.5 ? '1' : '0.4';
    });
}

function addCustomStation() {
    const name = customNameInput.value.trim();
    const url = customUrlInput.value.trim();
    const icon = customIconInput.value.trim();
    const freq = freqValue.textContent;

    if (!name || !url) {
        alert('Please provide at least a name and a stream URL.');
        return;
    }

    const newStation = {
        stationuuid: 'custom-' + Date.now(),
        name: `${name} (${freq} MHz)`,
        url: url,
        url_resolved: url,
        favicon: icon || DEFAULT_LOGO,
        country: 'Custom',
        tags: 'FM, Manual'
    };

    addToPlaylist(newStation);
    alert('Station added to your playlist!');
    
    // Clear inputs
    customNameInput.value = '';
    customUrlInput.value = '';
    customIconInput.value = '';
}

function startAutoScan() {
    autoScanBtn.disabled = true;
    autoScanBtn.innerHTML = '<i class="spin" data-lucide="refresh-cw"></i> Scanning...';
    lucide.createIcons();
    discoveredFrequencies = [];
    saveAllBtn.style.display = 'none';
    
    let currentFreq = 87.5;
    const interval = setInterval(() => {
        currentFreq = +(currentFreq + 0.5).toFixed(1);
        freqSlider.value = currentFreq;
        freqValue.textContent = currentFreq;
        updateSignalStrength(currentFreq);
        
        // Simulate finding "active" frequencies
        if (Math.random() > 0.7) {
            discoveredFrequencies.push(currentFreq);
            // Flash frequency display on find
            freqValue.style.color = 'var(--accent-color)';
            setTimeout(() => { freqValue.style.color = 'var(--text-primary)'; }, 200);
        }
        
        if (currentFreq >= 108) {
            clearInterval(interval);
            autoScanBtn.disabled = false;
            autoScanBtn.innerHTML = '<i data-lucide="zap"></i> Auto Scan Frequencies';
            lucide.createIcons();
            
            if (discoveredFrequencies.length > 0) {
                saveAllBtn.style.display = 'flex';
                saveAllBtn.textContent = `Save ${discoveredFrequencies.length} Frequencies`;
                alert(`Scan complete! Found ${discoveredFrequencies.length} active frequencies.`);
            } else {
                alert('Scan complete. No active frequencies found.');
            }
        }
    }, 100);
}

function saveAllDiscovered() {
    if (discoveredFrequencies.length === 0) return;
    
    discoveredFrequencies.forEach(freq => {
        const newStation = {
            stationuuid: 'auto-' + freq + '-' + Date.now(),
            name: `FM Station ${freq}`,
            url: `https://icecast.radio-browser.info/fm/${freq}`, // Placeholder URL
            url_resolved: `https://icecast.radio-browser.info/fm/${freq}`,
            favicon: DEFAULT_LOGO,
            country: 'Local Scan',
            tags: 'FM, Scanned'
        };
        currentPlaylist.push(newStation);
    });
    
    savePlaylist();
    renderPlaylist();
    saveAllBtn.style.display = 'none';
    alert(`${discoveredFrequencies.length} stations added to your playlist!`);
}

// Playback Logic
function playStation(index, source = 'search', element = null) {
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
            const prevStationText = `⏮️ Prev: ${list[pIdx].name || 'Unknown'}`;
            const nextStationText = `⏭️ Next: ${list[nIdx].name || 'Unknown'}`;
            
            queueTickerText.textContent = nextStationText;
            queueTickerText.style.color = '#00FF33';
            queueTickerText.style.textShadow = '0 0 5px #F7FF00, 1px 1px 2px #F7FF00';
            showingNextInQueue = true;
            
            clearInterval(queueTickerInterval);
            queueTickerInterval = setInterval(() => {
                queueTickerText.style.opacity = '0';
                setTimeout(() => {
                    if (showingNextInQueue) {
                        queueTickerText.textContent = prevStationText;
                        queueTickerText.style.color = '#FFFF00';
                        queueTickerText.style.textShadow = '0 0 5px #000000, 1px 1px 2px #000000';
                    } else {
                        queueTickerText.textContent = nextStationText;
                        queueTickerText.style.color = '#00FF33';
                        queueTickerText.style.textShadow = '0 0 5px #F7FF00, 1px 1px 2px #F7FF00';
                    }
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
        updatePlayPauseBtn();
    }).catch(e => {
        console.warn('Auto-play failed, user interaction required.', e);
        playerStatus.textContent = 'Click Play to start';
        if (e.name === 'NotAllowedError') {
            autoPlayBlocked = true;
        }
    });

    // Also update button immediately before promise resolves for instant feedback
    if (nowPlayingCard) nowPlayingCard.classList.add('playing');
    updatePlayPauseBtn();

    // Check if buffering takes too long (4.5 seconds auto-skip)
    clearTimeout(playCheckTimeout);
    playCheckTimeout = setTimeout(() => {
        if (autoPlayBlocked) return;
        
        if (audioPlayer.paused || audioPlayer.readyState === 0 || audioPlayer.error) {
            console.log('Station taking too long to buffer. Auto-skipping to next...');
            if (!audioPlayer.error) {
                playerStatus.textContent = 'Stream Slow - Auto-skipping...';
            }
            // Automatically play the next station
            let list = source === 'search' ? currentStations : currentPlaylist;
            if (list.length > 0) {
                currentStationIndex = (currentStationIndex + 1) % list.length;
                playStation(currentStationIndex, source);
            }
        }
    }, 4500);

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
        
        // Decrease font size 15% for names between 16-24 characters
        if (name.length >= 16 && name.length <= 24) {
            currentStationName.style.fontSize = 'clamp(1.275rem, 6.8vw, 2.125rem)';
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
    if (currentStations.length === 0) return;
    currentStationIndex = (currentStationIndex + 1) % currentStations.length;
    playStation(currentStationIndex, 'search');
}

function playPrevious() {
    if (currentStations.length === 0) return;
    currentStationIndex = (currentStationIndex - 1 + currentStations.length) % currentStations.length;
    playStation(currentStationIndex, 'search');
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
    
    // Check if station plays within 4 seconds
    playCheckTimeout = setTimeout(() => {
        if (!isSmartScanning) return;
        
        if (audioPlayer.paused || audioPlayer.readyState < 3) {
            // Failed or taking too long
            playerStatus.textContent = 'Skipping unresponsive station...';
            currentStationIndex = (currentStationIndex + 1) % currentStations.length;
            playSmartScanStation();
        } else {
            // Playing successfully, schedule next change in 6 seconds (Total 10s)
            smartScanTimeout = setTimeout(() => {
                if (!isSmartScanning) return;
                currentStationIndex = (currentStationIndex + 1) % currentStations.length;
                playSmartScanStation();
            }, 6000);
        }
    }, 4000);
}

// Start App
init();
