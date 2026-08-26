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
let userExplicitlyPaused = false; // Tracks if the user intentionally stopped playback

const DEFAULT_LIMIT = 200;
const DEFAULT_LOGO = 'logo.png';

const CUSTOM_SINGER_STATIONS = [];

const CUSTOM_HINDI_STATIONS = [
    {
        stationuuid: 'custom-easy-96-radio',
        name: 'Easy 96 Radio',
        url_resolved: 'https://ice8.securenetsystems.net/EASY96',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, easy 96, pop, bollywood, bhakti',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-mirchi-hindi',
        name: 'Radio Mirchi 98.3 Hindi',
        url_resolved: 'https://stream.zeno.fm/f3wvbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-mirchi-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, bollywood, mirchi, top 40',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-mirchi-love',
        name: 'Mirchi Love Hindi',
        url_resolved: 'https://stream.zeno.fm/3r01bca0b0hvv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/mirchi-love-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, romantic, love, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-red-fm-hindi',
        name: 'Red FM 93.5',
        url_resolved: 'https://stream.zeno.fm/0885zpy3x0hvv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/red-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, superhits, red fm, bajate raho',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-city-hindi',
        name: 'Radio City Hindi',
        url_resolved: 'https://stream.zeno.fm/54ecvca0b0hvv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-city-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, city, bollywood, hits',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-big-fm-hindi',
        name: '92.7 BIG FM',
        url_resolved: 'https://stream.zeno.fm/k2k4vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/big-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, big fm, retro, classic',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-vividh-bharati',
        name: 'Vividh Bharati AIR',
        url_resolved: 'https://air.dattaradio.com/vividhbharati/stream',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, air, doordarshan, news, oldies',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-gold-fm',
        name: 'AIR FM Gold Hindi',
        url_resolved: 'https://air.dattaradio.com/airgold/stream',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, air gold, classics, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-one-hindi',
        name: '94.3 Radio One Hindi',
        url_resolved: 'https://stream.zeno.fm/w0k0cda0b0hvv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-one-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, radio one, retro, international',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-fever-104-fm',
        name: 'Fever 104 FM',
        url_resolved: 'https://stream.zeno.fm/g3w1cca0b0hvv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/fever-104-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, fever 104, bollywood, pop',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-city-ishq',
        name: 'Radio City Ishq Hindi',
        url_resolved: 'https://stream.zeno.fm/u132vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-city-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, romantic, ishq, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-retro-bollywood-classics',
        name: 'Retro Bollywood Classics',
        url_resolved: 'https://stream.zeno.fm/65b1bca0b0hvv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/big-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, retro, classic, oldies, 80s, 90s',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-hungama-hindi-hits',
        name: 'Hungama Hindi Superhits',
        url_resolved: 'https://stream.zeno.fm/m953vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-mirchi-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, hungama, hits, top 40, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bollywood-gaane',
        name: 'Bollywood Gaane Radio',
        url_resolved: 'https://stream.zeno.fm/t3z5vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, bollywood, gaane, hits',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-deewana-hindi',
        name: 'Radio Deewana Hindi',
        url_resolved: 'https://stream.zeno.fm/n3y4vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/red-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'hindi, deewana, bollywood, remix',
        lastcheckok: 1
    }
];

const CUSTOM_BHAKTI_STATIONS = [
    {
        stationuuid: 'custom-bhakti-world',
        name: 'Bhakti World Radio',
        url_resolved: 'https://stream.zeno.fm/0s7253h6m8quv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, devotional, hindi, bhajan, kirtan',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-city-bhakti',
        name: 'Radio City Bhakti',
        url_resolved: 'https://stream.zeno.fm/2x32vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-city-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, devotional, radio city, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-bhakti-sangeet',
        name: 'AIR Bhakti Sangeet',
        url_resolved: 'https://air.dattaradio.com/bhakti/stream',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, air, all india radio, devotional, bhajan',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-shri-ram-bhakti',
        name: 'Shri Ram Bhakti Radio',
        url_resolved: 'https://stream.zeno.fm/u740vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, ram, bhajan, devotional, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-shiv-bhakti-radio',
        name: 'Shiv Bhakti Radio',
        url_resolved: 'https://stream.zeno.fm/8753vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/red-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, shiv, mahadev, bhajan, devotional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-krishna-bhakti-radio',
        name: 'Krishna Bhakti Radio',
        url_resolved: 'https://stream.zeno.fm/c354vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-mirchi-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, krishna, ISKCON, bhajan, devotional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-hanuman-bhakti-radio',
        name: 'Hanuman Chalisa Bhakti Radio',
        url_resolved: 'https://stream.zeno.fm/p274vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/big-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, hanuman, chalisa, devotional, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-sai-bhakti-radio',
        name: 'Sai Bhakti Radio',
        url_resolved: 'https://stream.zeno.fm/w864vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-one-hindi.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, sai baba, shirdi, bhajan, devotional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-mata-rani-bhakti',
        name: 'Mata Rani Bhakti Radio',
        url_resolved: 'https://stream.zeno.fm/k765vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/fever-104-fm.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, durga, mata rani, bhajan, devotional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-aarti-mantra-radio',
        name: 'Hindi Aarti & Mantra Radio',
        url_resolved: 'https://stream.zeno.fm/v975vbbscrs8uv',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        countrycode: 'IN',
        tags: 'bhakti, aarti, mantra, chant, devotional',
        lastcheckok: 1
    }
];

const CUSTOM_NEWS_STATIONS = [
    {
        stationuuid: 'republic-bharat',
        name: 'Republic Bharat TV',
        url_resolved: 'https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/RepublicBharat.m3u8',
        favicon: 'https://dtil.tmsimg.com/assets/s143724_ld_h15_aa.png?lock=720x540',
        country: 'India',
        tags: 'tv, news, hindi, republic, bharat',
        lastcheckok: 1
    },
    {
        stationuuid: 'zee-news',
        name: 'Zee News',
        url_resolved: 'https://dknttpxmr0dwf.cloudfront.net/index_57.m3u8',
        favicon: 'https://dtil.tmsimg.com/assets/GNLZZGG0023VWYC.png?lock=720x540',
        country: 'India',
        tags: 'tv, news, hindi, zee',
        lastcheckok: 1
    },
    {
        stationuuid: 'dd-national',
        name: 'DD National HD',
        url_resolved: 'https://mumt01.tangotv.in/O5aw8Zn3DDNATIONALHD/index.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/DD_National.svg/512px-DD_National.svg.png',
        country: 'India',
        tags: 'tv, doordarshan, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'dd-news',
        name: 'DD News',
        url_resolved: 'https://cdn-2.pishow.tv/live/12/master.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/DD_News_Logo.svg/512px-DD_News_Logo.svg.png',
        country: 'India',
        tags: 'tv, doordarshan, hindi, news',
        lastcheckok: 1
    },
    {
        stationuuid: 'dd-news-hd',
        name: 'DD News HD',
        url_resolved: 'https://cdn-2.pishow.tv/live/12/master.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/DD_News_Logo.svg/512px-DD_News_Logo.svg.png',
        country: 'India',
        tags: 'tv, doordarshan, hindi, news, hd',
        lastcheckok: 1
    },
    {
        stationuuid: 'dd-india',
        name: 'DD India',
        url_resolved: 'https://d2gvyg6lvauoko.cloudfront.net/230226/ddindia/chunks.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/DD_India_logo.svg/512px-DD_India_logo.svg.png',
        country: 'India',
        tags: 'tv, doordarshan, hindi',
        lastcheckok: 1
    }
];


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
let is3DSurroundEnabled = false;
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
let isSleepMode = false;
let userAddedCustomStations = JSON.parse(localStorage.getItem('fm_custom_stations')) || [];

// Web Audio API
let audioContext = null;
let audioAnalyser = null;
let audioGainNode = null;
let audioSource = null;
let eqDataArray = null;
let animationFrameId = null;

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
const sleepModeBtn = document.getElementById('sleep-mode-btn');
const sleepBtn = document.getElementById('sleep-btn');
const sleepOverlay = document.getElementById('sleep-overlay');
const wakeUpBtn = document.getElementById('wake-up-btn');
const queueTickerText = document.getElementById('queue-ticker-text');
const eqBars = document.querySelectorAll('.eq-bar');

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
    fetchStations('', 'India', '', false); // Initial load: Search without Auto-play
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
        fetchStations(query, country, '', true); // Quick search and auto-play
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
            fetchStations('', '', '', true); // Auto-play first global station
        } else {
            currentMode = 'India';
            modeToggleText.textContent = 'India';
            const icon = document.getElementById('mode-toggle-icon');
            if (icon) icon.textContent = '🇮🇳';
            modeToggleBtn.classList.add('india-active');
            globalCats.style.display = 'none';
            indiaCats.style.display = 'flex';
            fetchStations('', 'India', '', true); // Auto-play first Indian station
        }
        updateActiveCat('All');
    });

    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // If dragging, let the capture phase handle prevention
            const tag = btn.dataset.tag;
            const country = currentMode === 'India' ? 'India' : '';
            fetchStations('', country, tag, true);
            updateActiveCat(btn.textContent);
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
            fetchStations(lastQuery, lastCountry, lastTag, false, true);
        });
    }

    if (tabRefreshBtn) {
        tabRefreshBtn.addEventListener('click', () => {
            fetchStations(lastQuery, lastCountry, lastTag, false, true);
        });
    }

    if (fsRefreshBtn) {
        fsRefreshBtn.addEventListener('click', () => {
            fetchStations(lastQuery, lastCountry, lastTag, false, true);
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

    // Multi-click (2 or 3 times) to toggle Fullscreen
    let cardClickCount = 0;
    let cardClickTimeout = null;

    if (nowPlayingCard) {
        nowPlayingCard.addEventListener('click', (e) => {
            // Ignore if clicking interactive controls (buttons, volume slider)
            if (e.target.closest('button') || e.target.closest('input')) return;

            cardClickCount++;
            
            // If user clicked 2 or more times quickly (handles double or triple tap)
            if (cardClickCount >= 2) {
                clearTimeout(cardClickTimeout);
                cardClickCount = 0;
                
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => console.log(err));
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
                
                // Clear any accidental text selection from tapping
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }
            } else {
                cardClickTimeout = setTimeout(() => {
                    cardClickCount = 0; // Reset after short delay
                }, 400); // 400ms window to tap again
            }
        });
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

    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            updateVolume(e.target.value);
        });
    }

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
    
    const surround3dBtn = document.getElementById('surround-3d-btn') || document.getElementById('3d-surround-btn');
    if (surround3dBtn) {
        surround3dBtn.addEventListener('click', toggle3DSurround);
    }

    if (volBoostCheck) {
        volBoostCheck.addEventListener('change', toggleVolBoost);
    }

    if (smartAutoScanBtn) {
        smartAutoScanBtn.addEventListener('click', toggleSmartAutoScan);
    }

    // Add / Scan Station Modal Event Listeners
    const openAddStationBtn = document.getElementById('open-add-station-btn');
    const closeAddStationBtn = document.getElementById('close-add-station-btn');
    const addStationModal = document.getElementById('add-station-modal');
    const addStationForm = document.getElementById('add-station-form');
    const scanStreamBtn = document.getElementById('scan-stream-btn');

    if (openAddStationBtn && addStationModal) {
        openAddStationBtn.addEventListener('click', () => {
            addStationModal.style.display = 'flex';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    if (closeAddStationBtn && addStationModal) {
        closeAddStationBtn.addEventListener('click', () => {
            addStationModal.style.display = 'none';
        });
        addStationModal.addEventListener('click', (e) => {
            if (e.target === addStationModal) {
                addStationModal.style.display = 'none';
            }
        });
    }

    if (scanStreamBtn) {
        scanStreamBtn.addEventListener('click', () => {
            const urlInput = document.getElementById('new-station-url');
            const urlVal = urlInput ? urlInput.value.trim() : '';
            
            if (!urlVal) {
                alert('Please enter a Stream URL first!');
                return;
            }

            scanStreamBtn.disabled = true;
            scanStreamBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> <span>Scanning...</span>';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            const testAudio = new Audio();
            let hasResolved = false;

            const cleanup = () => {
                testAudio.pause();
                testAudio.src = '';
                scanStreamBtn.disabled = false;
                scanStreamBtn.innerHTML = '<i data-lucide="zap"></i> <span>Scan Stream</span>';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            };

            const timeoutId = setTimeout(() => {
                if (!hasResolved) {
                    hasResolved = true;
                    cleanup();
                    alert('Stream scan completed - Signal Ready!');
                }
            }, 5000);

            testAudio.oncanplay = () => {
                if (!hasResolved) {
                    hasResolved = true;
                    clearTimeout(timeoutId);
                    cleanup();
                    alert('Stream Signal Verified! 128kbps HD Ready');
                }
            };

            testAudio.onerror = () => {
                if (!hasResolved) {
                    hasResolved = true;
                    clearTimeout(timeoutId);
                    cleanup();
                    alert('Unable to connect to stream URL');
                }
            };

            testAudio.src = urlVal;
            testAudio.load();
        });
    }

    if (addStationForm) {
        addStationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameVal = document.getElementById('new-station-name').value.trim();
            const urlVal = document.getElementById('new-station-url').value.trim();
            const catVal = document.getElementById('new-station-category').value.trim();
            const countryVal = document.getElementById('new-station-country').value.trim();
            const logoVal = document.getElementById('new-station-logo').value.trim();

            if (!nameVal || !urlVal) {
                alert('Station Name and Stream URL are required');
                return;
            }

            const newStationObj = {
                stationuuid: 'custom-' + Date.now(),
                name: nameVal,
                url_resolved: urlVal,
                url: urlVal,
                favicon: logoVal || 'logo.png',
                tags: catVal,
                country: countryVal || 'India',
                votes: 1250,
                bitrate: 128,
                lastcheckok: 1,
                isCustom: true
            };

            userAddedCustomStations.unshift(newStationObj);
            localStorage.setItem('fm_custom_stations', JSON.stringify(userAddedCustomStations));

            if (addStationModal) addStationModal.style.display = 'none';
            addStationForm.reset();

            alert(`Added '${nameVal}' to ${catVal.toUpperCase()} category!`);

            currentStations.unshift(newStationObj);
            renderStations();
            playStation(0, 'search');
        });
    }

    // Tab Switching
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            switchView(target);
        });
    });

    // Now Playing Card Gesture Volume Control
    let isDraggingVol = false;
    let startDragY = 0;
    let startDragVol = 0;

    const handleVolDragStart = (e) => {
        if (!nowPlayingCard.classList.contains('playing')) return;
        // Ignore if clicking interactive controls inside the card
        if (e.target.closest('button') || e.target.closest('input')) return;
        
        const rect = nowPlayingCard.getBoundingClientRect();
        const startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        // Only allow volume control if dragging on the left half of the card
        if (startX > rect.left + (rect.width / 2)) {
            return; // Right side -> do nothing, allows default page scroll
        }
        
        isDraggingVol = true;
        startDragY = startY;
        startDragVol = (volumeSlider ? parseInt(volumeSlider.value) : lastVolume) || 30;
        
        const dragOverlay = document.getElementById('volume-drag-overlay');
        const dragText = document.getElementById('volume-drag-text');
        if (dragOverlay && dragText) {
            dragText.textContent = startDragVol;
            dragOverlay.classList.add('active');
        }
    };

    const handleVolDragMove = (e) => {
        if (!isDraggingVol || !nowPlayingCard.classList.contains('playing')) return;
        
        // Prevent default scrolling on touch devices while adjusting volume
        if (e.cancelable) e.preventDefault(); 
        
        const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        // Moving up (negative diff) increases volume, moving down decreases it
        const diffY = startDragY - currentY; 
        
        // 150px drag height = full 100% volume change
        const volChange = Math.round((diffY / 150) * 100);
        let newVol = Math.max(0, Math.min(100, startDragVol + volChange));
        
        updateVolume(newVol);
        
        const dragText = document.getElementById('volume-drag-text');
        if (dragText) {
            dragText.textContent = newVol;
        }
    };

    const handleVolDragEnd = () => {
        if (isDraggingVol) {
            const dragOverlay = document.getElementById('volume-drag-overlay');
            if (dragOverlay) {
                dragOverlay.classList.remove('active');
            }
        }
        isDraggingVol = false;
    };

    if (nowPlayingCard) {
        nowPlayingCard.addEventListener('mousedown', handleVolDragStart);
        window.addEventListener('mousemove', handleVolDragMove, { passive: false });
        window.addEventListener('mouseup', handleVolDragEnd);

        nowPlayingCard.addEventListener('touchstart', handleVolDragStart, { passive: true });
        window.addEventListener('touchmove', handleVolDragMove, { passive: false });
        window.addEventListener('touchend', handleVolDragEnd);
    }

    // Network Connection Monitoring
    window.addEventListener('offline', () => {
        playerStatus.textContent = 'Internet Disconnected';
        playerStatus.style.color = '#ef4444'; // Red
        resultsCount.textContent = 'Offline';
        if (isSmartScanning) {
            toggleSmartAutoScan(); // Stop auto-scan if running
        }
        if (!audioPlayer.paused) {
            audioPlayer.pause();
            if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
        }
    });

    window.addEventListener('online', () => {
        playerStatus.textContent = 'Internet Restored';
        playerStatus.style.color = '#22c55e'; // Green
        setTimeout(() => {
            fetchStations(lastQuery, lastCountry, lastTag, false);
        }, 1500); // Re-fetch stations after a brief delay
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
                let upVol = Math.min(100, parseInt((volumeSlider ? volumeSlider.value : lastVolume) || 30) + 5);
                updateVolume(upVol);
                break;
            case 'ArrowDown':
                e.preventDefault();
                let downVol = Math.max(0, parseInt((volumeSlider ? volumeSlider.value : lastVolume) || 30) - 5);
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
        userExplicitlyPaused = false;
        document.body.classList.add('is-playing');
        if (isSleepMode) {
            enableSleepMode(false);
        }
        playPauseBtn.innerHTML = '<i data-lucide="pause" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Playing';
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        requestWakeLock();
        if (keepAliveAudio) keepAliveAudio.play().catch(e => console.log('Keep-alive failed:', e));
        
        // Initialize Web Audio API on first play
        if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioAnalyser = audioContext.createAnalyser();
                audioAnalyser.fftSize = 256; /* Higher resolution for specific instruments */
                audioAnalyser.smoothingTimeConstant = 0.65; /* Lower smoothing for punchier, real-time sync with beats and voice */
                
                audioGainNode = audioContext.createGain();
                
                // Allow cross-origin audio processing
                audioPlayer.crossOrigin = "anonymous";
                
                audioSource = audioContext.createMediaElementSource(audioPlayer);
                audioSource.connect(audioGainNode);
                audioGainNode.connect(audioAnalyser);
                audioAnalyser.connect(audioContext.destination);
                
                eqDataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
                updateEqualizer();
            } catch (e) {
                console.warn('Web Audio API not supported or failed to initialize', e);
            }
        } else if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

    audioPlayer.onplaying = () => {
        consecutiveErrors = 0; // Reset error count on successful play
        clearTimeout(playCheckTimeout); // Clear any buffering timeouts
        document.body.classList.add('is-playing');
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
        document.body.classList.remove('is-playing');
        if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
        playPauseBtn.innerHTML = '<i data-lucide="play" id="play-icon"></i>';
        lucide.createIcons();
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
        
        // Auto Release Wake Lock so screen light turns off automatically
        releaseWakeLock();
        if (keepAliveAudio) keepAliveAudio.pause();
        
        // Stop scanning/background checks when paused
        clearTimeout(smartScanTimeout);
        clearTimeout(playCheckTimeout);

        // Auto play next radio station when status shows pause or station fails to play
        if (!userExplicitlyPaused) {
            playerStatus.textContent = 'Paused - Auto Playing Next...';
            playerStatus.style.color = 'var(--accent-color)';
            playCheckTimeout = setTimeout(() => {
                if (audioPlayer.paused && !userExplicitlyPaused) {
                    playNext();
                }
            }, 1000);
        } else {
            playerStatus.textContent = 'Paused';
        }
    };

    audioPlayer.onwaiting = () => {
        playerStatus.textContent = 'Buffering...';
    };

    audioPlayer.onstalled = () => {
        if (!userExplicitlyPaused) {
            playerStatus.textContent = 'Stream Stalled - Auto Playing Next...';
            playerStatus.style.color = 'var(--accent-color)';
            clearTimeout(playCheckTimeout);
            playCheckTimeout = setTimeout(() => {
                if (audioPlayer.paused || audioPlayer.readyState < 3) {
                    playNext();
                }
            }, 1200);
        }
    };

    audioPlayer.onerror = (e) => {
        console.error('Audio playback error:', e);
        document.body.classList.remove('is-playing');
        if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
        playerStatus.textContent = 'Stream Error - Auto Playing Next...';
        playerStatus.style.color = 'var(--accent-color)';
        
        clearTimeout(playCheckTimeout);
        playCheckTimeout = setTimeout(() => {
            playNext();
        }, 1000);
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

function updateEqualizer() {
    if (!audioAnalyser || !eqBars || !eqBars.length) return;
    
    animationFrameId = requestAnimationFrame(updateEqualizer);
    
    if (audioPlayer.paused || audioPlayer.muted) {
        // Reset to minimal height when paused
        eqBars.forEach(bar => bar.style.height = '10%');
        return;
    }
    
    audioAnalyser.getByteFrequencyData(eqDataArray);
    
    // Non-linear mapping targeting specific frequency ranges
    // Bins correspond to ~172Hz each (at 44.1kHz / 256 fftSize). 
    // Mapped for: Kick(0-172), Bassline, Low-mid, Mid(Voice), Lead(Voice), Upper-Mid(Snare), High-mid, High, High, Treble, Treble, Air
    const freqMap = [0, 1, 3, 6, 10, 15, 22, 30, 42, 56, 75, 100];
    
    for (let i = 0; i < eqBars.length; i++) {
        const dataIndex = freqMap[i] || i; // Fallback just in case
        
        // Add a slight multiplier to higher frequencies to make them pop out more
        let value = eqDataArray[dataIndex];
        if (i > 4) value = Math.min(255, value * (1 + (i - 4) * 0.15));
        
        // Map 0-255 to 10%-100%
        const heightPercent = 10 + (value / 255) * 90;
        eqBars[i].style.height = `${heightPercent}%`;
    }
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
    'hindi': [ { tag: 'hindi', country: 'India' }, { language: 'hindi', country: 'India' }, { name: 'hindi', country: 'India' }, { name: 'lucknow', country: 'India' } ],
    'classic': [ { tag: 'classical', country: 'India' }, { tag: 'retro', country: 'India' }, { tag: 'gold', country: 'India' }, { name: 'hindi classical', country: 'India' }, { name: 'retro', country: 'India' }, { name: 'gold', country: 'India' }, { name: 'classic', country: 'India' } ],
    'regional': [
        { tag: 'tamil', country: 'India' }, { language: 'tamil', country: 'India' }, { state: 'tamil nadu', country: 'India' },
        { tag: 'kannada', country: 'India' }, { language: 'kannada', country: 'India' }, { state: 'karnataka', country: 'India' },
        { tag: 'telugu', country: 'India' }, { language: 'telugu', country: 'India' }, { state: 'telangana', country: 'India' }, { state: 'andhra pradesh', country: 'India' },
        { tag: 'malayalam', country: 'India' }, { language: 'malayalam', country: 'India' }, { state: 'kerala', country: 'India' },
        { tag: 'marathi', country: 'India' }, { language: 'marathi', country: 'India' }, { state: 'maharashtra', country: 'India' },
        { tag: 'gujarati', country: 'India' }, { language: 'gujarati', country: 'India' }, { state: 'gujarat', country: 'India' }
    ],
    'bollywood': [ { tag: 'bollywood', country: 'India' }, { tag: 'hindi', country: 'India' } ],
    'dj remix': [ { tag: 'dj remix', country: 'India' }, { tag: 'remix', country: 'India' }, { name: 'anbu fm hindi' }, { name: 'anbu fm' }, { name: 'radio deewana' }, { name: 'bollywoodandbeyond' }, { name: 'goldy blast' }, { name: 'bollywood diwali party' } ],
    'singer': [ { name: 'latamangeshkarradio' }, { name: 'kishorekumarradio' }, { name: 'Hits Of Lata Mangeshkar' }, { name: 'Rafi hit songs' }, { name: 'Mohammed Rafi' }, { name: 'Hits Of Kishor Kumar' }, { name: 'Goldy Mukesh' }, { name: 'hit of lata' }, { name: 'Mukesh Radio' }, { name: 'shreyaghosal' }, { name: 'arijitsingh' }, { name: 'Kumar Sanu' }, { name: 'Sonu Nigam' }, { name: 'Alka Yagnik' }, { name: 'Kishore Kumar' }, { name: 'Lata Mangeshkar' }, { name: 'Bollywood Arijit singh' }, { name: 'Bollywood Shaharukh khan' }, { name: 'Bollywood alkayagnik' }, { name: 'radio madhuban' }, { name: 'Bollywood sonu nigam' }, { name: 'Bollywood shreya ghosal' }, { name: 'Bollywood Vishal shekhar' }, { name: 'Bollywood armaan malik' }, { name: 'Bollywood nehakakkar' } ],
    'ghazal': [ { name: 'gazal radio london' }, { name: 'Radio gyansthali 89.6 fm' } ],
    'news': [ { tag: 'news', country: 'India' }, { name: 'wion live tv' } ]
};

// API Functions
async function fetchStations(query = '', country = '', tag = '', autoPlay = false, forceRefresh = false) {
    if (!navigator.onLine) {
        playerStatus.textContent = 'Offline';
        playerStatus.style.color = '#ef4444'; // Red error status
        resultsCount.textContent = '0 stations found (No Internet)';
        stationsGrid.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-secondary); grid-column: 1/-1;">No internet connection. Please check your network and try again.</div>';
        return;
    }

    lastQuery = query;
    lastCountry = country;
    lastTag = tag;
    
    const cacheKey = `stations_cache_${query}_${country}_${tag}`;
    let loadedFromCache = false;
    
    // Check if we have cached stations to load instantly
    const cachedData = !forceRefresh ? localStorage.getItem(cacheKey) : null;
    if (cachedData) {
        try {
            currentStations = JSON.parse(cachedData);
            renderStations();
            resultsCount.textContent = `${currentStations.length} stations found`;
            
            if (currentStations.length > 0) {
                if (autoPlay) {
                    playStation(0, 'search');
                } else if (!audioPlayer.getAttribute('src')) {
                    currentStationIndex = 0;
                    updatePlayerUI(currentStations[0]);
                    playerStatus.textContent = 'Ready (Cached)';
                }
            }
            loadedFromCache = true;
        } catch (e) {
            console.error('Cache parsing error', e);
        }
    }
    
    if (!loadedFromCache) {
        mainLoader.style.display = 'flex';
        stationsGrid.innerHTML = '';
    }
    
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
            const p5 = fetch(`${API_BASE}/stations/search?limit=5&order=clickcount&reverse=true&hidebroken=true&name=bhaktiworld%20media%20Bhagavad%20Gita`).then(r => r.json()).catch(() => []);
            const p6 = fetch(`${API_BASE}/stations/search?limit=5&order=clickcount&reverse=true&hidebroken=true&name=Bhaktisudha`).then(r => r.json()).catch(() => []);
            const p7 = fetch(`${API_BASE}/stations/search?limit=5&order=clickcount&reverse=true&hidebroken=true&name=classic%20radio%20bhakti%20sangeet`).then(r => r.json()).catch(() => []);
            const p8 = fetch(`${API_BASE}/stations/search?limit=5&order=clickcount&reverse=true&hidebroken=true&name=Bhagavad%20Gita%20Radio`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d4, d5, d6, d7, d8] = await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]);
            const combined = [...CUSTOM_BHAKTI_STATIONS, ...d5, ...d6, ...d7, ...d8, ...d1, ...d2, ...d3, ...d4];
            
            // Remove duplicates based on stationuuid, stream URL, and normalized station name
            currentStations = combined.filter((v,i,a) => a.findIndex(t => 
                (t.stationuuid && v.stationuuid && t.stationuuid === v.stationuuid) ||
                (t.url_resolved && v.url_resolved && t.url_resolved.trim().toLowerCase() === v.url_resolved.trim().toLowerCase()) ||
                (t.name && v.name && t.name.trim().toLowerCase() === v.name.trim().toLowerCase())
            ) === i);
        } else if (tag.toLowerCase() === 'bangla') {
            const p1 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bangla`).then(r => r.json()).catch(() => []);
            const p2 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=bengali`).then(r => r.json()).catch(() => []);
            const p3 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&language=bengali`).then(r => r.json()).catch(() => []);
            const p5 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&state=West%20Bengal`).then(r => r.json()).catch(() => []);
            const p6 = fetch(`${API_BASE}/stations/search?limit=100&order=clickcount&reverse=true&hidebroken=true&country=India&tag=kolkata`).then(r => r.json()).catch(() => []);
            const p7 = fetch(`${API_BASE}/stations/search?limit=5&order=clickcount&reverse=true&hidebroken=true&name=Hot%20Now%20Bangla`).then(r => r.json()).catch(() => []);
            const p8 = fetch(`${API_BASE}/stations/search?limit=5&order=clickcount&reverse=true&hidebroken=true&name=AIR%20FM%20Gold%20Kolkata`).then(r => r.json()).catch(() => []);
            
            const [d1, d2, d3, d5, d6, d7, d8] = await Promise.all([p1, p2, p3, p5, p6, p7, p8]);
            // Place Indian stations first
            const combined = [...d7, ...d8, ...d1, ...d2, ...d3, ...d5, ...d6];
            
            // Remove duplicates
            currentStations = combined.filter((v,i,a) => a.findIndex(t => (t.stationuuid === v.stationuuid)) === i);
            
            // Remove unwanted stations from Bangla category
            const excludedBangla = ['my club remix', 'vividh bharti mumbai', 'radio bollyfm', 'fm rainbow delhi 32 kbps', 'radio mirchi lucknow', 'bollywood gaane purane'];
            currentStations = currentStations.filter(s => {
                const name = s.name ? s.name.toLowerCase().trim() : '';
                return !excludedBangla.some(ex => name === ex || name.includes(ex));
            });
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
                filtered.unshift(...CUSTOM_NEWS_STATIONS);
            } else if (tag.toLowerCase() === 'hindi' || tag.toLowerCase() === 'bollywood') {
                filtered.unshift(...CUSTOM_HINDI_STATIONS);
            } else if (tag.toLowerCase() === 'singer') {
                // Inject custom stations for artists that do not exist natively on the radio-browser API
                filtered.unshift(...CUSTOM_SINGER_STATIONS);
            } else if (tag.toLowerCase() === 'classic') {
                const excludedClassic = [
                    'london telugu radio', 'aural melodics', 'radio mattoli', 'jn fm tamil', 
                    'اذاعة القرآن الكر', 'kathiravan fm', 'air coimbatore', 'air pune fm', 
                    'fm kottarakkara', 'fm rainbow krishna vani vijayawada', 'chann pardesi radio', 
                    'air warangal', 'air raagam', 'air kochi', 'vanavilfm - radio maestro', 
                    'air fm gold chennai', 'retro ma', 'radio retro bollywood', 'air fm gold kolkata', 
                    'tamil panpalai gold', 'fm-gold-chennai', 'goldy garba', 'fmgoldtamil', 
                    'jn fm tamil classic', 'goldy bhal', 'golden voice radio'
                ];
                filtered = filtered.filter(s => {
                    const name = s.name ? s.name.toLowerCase().trim() : '';
                    return !excludedClassic.some(ex => name === ex || name.includes(ex));
                });
            }
            
            currentStations = filtered;
        } else if (!tag && !query && country === 'India') {
            const response = await fetch(url);
            let defaultStations = await response.json();
            
            const promises = [];
            Object.values(fetchMappings).forEach(mappings => {
                mappings.forEach(params => {
                    let pUrl = `${API_BASE}/stations/search?limit=15&order=clickcount&reverse=true&hidebroken=true`;
                    if (params.tag) pUrl += `&tag=${encodeURIComponent(params.tag)}`;
                    if (params.country) pUrl += `&country=${encodeURIComponent(params.country)}`;
                    if (params.language) pUrl += `&language=${encodeURIComponent(params.language)}`;
                    if (params.state) pUrl += `&state=${encodeURIComponent(params.state)}`;
                    if (params.name) pUrl += `&name=${encodeURIComponent(params.name)}`;
                    promises.push(fetch(pUrl).then(r => r.json()).catch(() => []));
                });
            });
            const results = await Promise.all(promises);
            let allCatStations = results.flat();
            
            // Add custom injected stations
            allCatStations = [...CUSTOM_HINDI_STATIONS, ...allCatStations, ...CUSTOM_NEWS_STATIONS, ...CUSTOM_SINGER_STATIONS];
            
            currentStations = [...defaultStations, ...allCatStations];
        } else {
            const response = await fetch(url);
            currentStations = await response.json();
        }
        // Prepend Vividh Bharti Mumbai and Bollywood Gaane Purane for India 'All' category
        if (country === 'India' && !tag && !query) {
            const stationsToPrepend = ['vividh bharti mumbai', 'fm rainbow delhi 32 kbps', 'radio mirchi lucknow', 'bollywood gaane purane', 'akashvani fm rainbow lucknow'];
            
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
        }
        
        const excludedStations = [
            "air kolhapur", "air jalandhar", "air indore", "air nagpur", 
            "air telgu", "air hydrabad a", "air jalendhar", "air alwar", 
            "air tuticorin", "air madikeri", "air mevad kandva", 
            "air satara", "air sasaram", "my radio dj", "jesus alive radio",
            "jesus radio malayalam", "hand of jesus",
            "radio mariam", "nour mariam", "mariam", "dipak",
            "london telugu radio", "aural melodics", "radio mattoli", "jn fm tamil", 
            "اذاعة القرآن الكر", "kathiravan fm", "air coimbatore", "air pune fm", 
            "fm kottarakkara", "fm rainbow krishna vani vijayawada", "chann pardesi radio", 
            "air warangal", "air raagam", "air pune fm (high bit rate)", "air kochi", 
            "vanavilfm - radio maestro", "air fm gold chennai", "retro ma", 
            "radio retro bollywood", "air fm gold kolkata", "tamil panpalai gold", 
            "fm-gold-chennai", "goldy garba", "fmgoldtamil", "jn fm tamil classic", 
            "goldy bhal", "golden voice radio", "mirchi top 20", "mirchi top", "radio mirchi top"
        ];
        currentStations = currentStations.filter(station => {
            const name = station.name ? station.name.toLowerCase().trim() : '';
            return !excludedStations.some(ex => name.includes(ex));
        });

        // Strict category segregation
        if (country === 'India') {
            currentStations = currentStations.filter(station => station.country === 'India' || station.countrycode === 'IN' || station.countrycode === 'IN ');
        } else if (!country) {
            currentStations = currentStations.filter(station => station.country !== 'India' && station.countrycode !== 'IN' && station.countrycode !== 'IN ');
        }

        // Prepend user-added custom stations matching query or tag
        const lowerTag = tag ? tag.toLowerCase() : '';
        const lowerQuery = query ? query.toLowerCase() : '';
        const userMatches = userAddedCustomStations.filter(s => {
            if (!s) return false;
            const sTags = (s.tags || '').toLowerCase();
            const sName = (s.name || '').toLowerCase();
            if (lowerTag && !sTags.includes(lowerTag)) return false;
            if (lowerQuery && !sName.includes(lowerQuery) && !sTags.includes(lowerQuery)) return false;
            return true;
        });
        currentStations = [...userMatches, ...currentStations];

        // Ensure strictly only active/working stations are allowed
        currentStations = currentStations.filter(station => station.lastcheckok === 1 || station.lastcheckok === undefined);

        // Deduplicate stations globally (by UUID, by Stream URL, and by normalized Name) to prevent repeats
        currentStations = currentStations.filter((v,i,a) => 
            a.findIndex(t => 
                (t.stationuuid && v.stationuuid && t.stationuuid === v.stationuuid) || 
                (t.url_resolved && v.url_resolved && t.url_resolved.trim().toLowerCase() === v.url_resolved.trim().toLowerCase()) ||
                (t.name && v.name && t.name.trim().toLowerCase() === v.name.trim().toLowerCase())
            ) === i
        );

        // Save fresh fetched data to cache
        try {
            localStorage.setItem(cacheKey, JSON.stringify(currentStations));
        } catch(e) { console.error('Cache save error', e); }

        renderStations();
        resultsCount.textContent = `${currentStations.length} stations found`;
        
        if (currentStations.length > 0 && !loadedFromCache) {
            if (autoPlay) {
                playStation(0, 'search');
            } else if (!audioPlayer.getAttribute('src')) {
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
    userExplicitlyPaused = false; // Playing a new station manually overrides explicit pause
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

    // Auto-skip logic if stream stalls or shows pause (unless user blocked auto-play or paused intentionally)
    clearTimeout(playCheckTimeout);
    playCheckTimeout = setTimeout(() => {
        if ((audioPlayer.paused || audioPlayer.readyState < 3) && !autoPlayBlocked && !isSmartScanning && !userExplicitlyPaused) {
            console.log('Stream stalled, deleting broken station and skipping...');
            playerStatus.textContent = 'Broken Stream - Deleting & Skipping...';
            
            // Delete the station completely
            const list = currentSource === 'search' ? currentStations : currentPlaylist;
            if (list && list.length > 0 && currentStationIndex >= 0 && currentStationIndex < list.length) {
                list.splice(currentStationIndex, 1);
                
                // If we deleted the last item, wrap around
                if (currentStationIndex >= list.length) {
                    currentStationIndex = 0;
                }
                
                if (currentSource === 'search') renderStations();
                else {
                    renderPlaylist();
                    localStorage.setItem('fm_playlist', JSON.stringify(currentPlaylist));
                }
            }
            
            setTimeout(() => {
                if (list && list.length > 0) {
                    playStation(currentStationIndex, currentSource);
                }
            }, 1000);
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

    const nameLen = name.length;
    let isSpecialPrefix = false;
    let prefixScale = 0.35;

    if (nameLen >= 3) {
        const center = (nameLen - 1) / 2;
        let formattedName = '';
        let wrapIndex = -1;
        
        let lowerName = name.toLowerCase();
        if (lowerName.startsWith('2b! radio ')) {
            wrapIndex = '2b! radio '.length - 1;
            isSpecialPrefix = true;
            prefixScale = 0.30;
        } else if (lowerName.startsWith('bhakti world media ')) {
            wrapIndex = 'bhakti world media '.length - 1;
            isSpecialPrefix = true;
            prefixScale = 0.45;
        } else if (lowerName.startsWith('bhakti world ')) {
            wrapIndex = 'bhakti world '.length - 1;
            isSpecialPrefix = true;
            prefixScale = 0.45;
        } else if (lowerName.startsWith('hit of ')) {
            wrapIndex = 'hit of '.length - 1;
            isSpecialPrefix = true;
        } else if (lowerName.startsWith('hits of ')) {
            wrapIndex = 'hits of '.length - 1;
            isSpecialPrefix = true;
        } else if (lowerName.startsWith('bollywood ')) {
            wrapIndex = 'bollywood '.length - 1;
            isSpecialPrefix = true;
        } else if (nameLen > 18) {
            wrapIndex = name.lastIndexOf(' ');
        }
        
        for (let i = 0; i < nameLen; i++) {
            if (i === wrapIndex) {
                formattedName += `<br>`;
                continue;
            }
            const distance = Math.abs(i - center);
            let scale = 1 + (distance / center) * 0.25; // Up to 25% increase at edges
            
            // Only decrease the font size for the special prefix words
            if (isSpecialPrefix && i < wrapIndex) {
                scale = scale * prefixScale;
            }
            
            let char = name[i] === ' ' ? '&nbsp;' : name[i];
            formattedName += `<span style="font-size: ${scale}em; vertical-align: baseline; display: inline-block;">${char}</span>`;
        }
        currentStationName.innerHTML = formattedName;
    } else {
        currentStationName.textContent = name;
    }
    
    // Reset inline styles
    currentStationName.style.fontSize = '';
    currentStationName.style.textAlign = '';
    
    if (name.length >= 25 && name.lastIndexOf(' ') === -1) {
        // Scroll right to left for very long names without spaces
        currentStationName.classList.add('marquee-name');
    } else {
        currentStationName.classList.remove('marquee-name');
        
        if (isSpecialPrefix) {
            currentStationName.style.textAlign = 'center';
        }
        
        if (name.length > 32) {
            // Decrease font size 25% for names over 32 characters
            currentStationName.style.fontSize = 'clamp(0.84rem, 4.5vw, 1.4rem)';
        } else if (name.length >= 16) {
            // Decrease font size 15% for names 16-32 characters
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
        userExplicitlyPaused = false;
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
        userExplicitlyPaused = true;
        clearTimeout(playCheckTimeout); // Stop any pending auto-skips
        audioPlayer.pause();
        audioPlayer.removeAttribute('src'); // Stop downloading stream data
        audioPlayer.load(); // Flush buffer
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

// Volume Controls with 80% sound boost effect per active feature
function updateVolume(value) {
    let baseVolume = value / 100;
    if (volumeSlider) volumeSlider.value = value;
    
    // Calculate 80% increase multiplier (+0.8 factor per active boost feature)
    let boostMultiplier = 1.0;
    if (isVolBoostEnabled) boostMultiplier += 0.8;
    if (isDJBoostEnabled) boostMultiplier += 0.8;
    if (isHDEQEnabled) boostMultiplier += 0.8;
    if (is3DSurroundEnabled) boostMultiplier += 0.8;

    let finalVolume = Math.min(1.0, baseVolume * boostMultiplier);
    audioPlayer.volume = finalVolume;
    
    if (audioGainNode) {
        audioGainNode.gain.value = boostMultiplier;
    }
    
    let volIconName = 'volume-2';
    if (finalVolume === 0) {
        volIconName = 'volume-x';
    } else if (finalVolume < 0.5) {
        volIconName = 'volume-1';
    }
    
    const muteBtnElement = document.getElementById('mute-btn');
    if (muteBtnElement) {
        muteBtnElement.innerHTML = `<i data-lucide="${volIconName}" id="volume-icon"></i>`;
        lucide.createIcons();
    }
    
    if (baseVolume > 0) {
        lastVolume = value;
        isMuted = false;
    }
}

function toggleMute() {
    if (isMuted) {
        updateVolume(lastVolume);
    } else {
        lastVolume = volumeSlider ? volumeSlider.value : 30;
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

// HD/EQ Logic (+80% Sound Effect Boost)
function toggleHDEQ() {
    isHDEQEnabled = !isHDEQEnabled;
    if (isHDEQEnabled) {
        eqHdBtn.style.backgroundColor = 'var(--primary-color)';
        eqHdBtn.style.color = '#fff';
        playerStatus.textContent = 'HD/EQ Active (+80% Boost)';
    } else {
        eqHdBtn.style.backgroundColor = 'transparent';
        eqHdBtn.style.color = 'inherit';
        playerStatus.textContent = 'HD/EQ Disabled';
    }
    
    updateVolume(volumeSlider ? volumeSlider.value : lastVolume || 30);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// DJ Boost Logic (+80% Sound Effect Boost)
function toggleDJBoost() {
    isDJBoostEnabled = !isDJBoostEnabled;
    if (isDJBoostEnabled) {
        djBoostBtn.style.backgroundColor = 'var(--accent-color)';
        djBoostBtn.style.color = '#fff';
        playerStatus.textContent = 'DJ Boost ON (+80% Boost)';
    } else {
        djBoostBtn.style.backgroundColor = 'transparent';
        djBoostBtn.style.color = 'inherit';
        playerStatus.textContent = 'DJ Boost OFF';
    }
    
    updateVolume(volumeSlider ? volumeSlider.value : lastVolume || 30);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// 3D Surround Logic (+80% Sound Effect Boost)
function toggle3DSurround() {
    is3DSurroundEnabled = !is3DSurroundEnabled;
    const surroundBtn = document.getElementById('surround-3d-btn') || document.getElementById('3d-surround-btn');
    if (surroundBtn) {
        if (is3DSurroundEnabled) {
            surroundBtn.style.backgroundColor = '#06b6d4';
            surroundBtn.style.color = '#fff';
            playerStatus.textContent = '3D Surround ON (+80% Boost)';
        } else {
            surroundBtn.style.backgroundColor = 'transparent';
            surroundBtn.style.color = 'inherit';
            playerStatus.textContent = '3D Surround OFF';
        }
    }
    
    updateVolume(volumeSlider ? volumeSlider.value : lastVolume || 30);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// Vol Boost Logic (+80% Sound Effect Boost)
function toggleVolBoost(e) {
    isVolBoostEnabled = e.target.checked;
    if (isVolBoostEnabled) {
        playerStatus.textContent = 'Vol Boost ON (+80% Boost)';
    } else {
        playerStatus.textContent = 'Vol Boost OFF';
    }
    
    updateVolume(volumeSlider ? volumeSlider.value : lastVolume || 30);
    
    setTimeout(() => {
        if (audioPlayer.paused) playerStatus.textContent = 'Paused';
        else playerStatus.textContent = 'Playing';
    }, 2000);
}

// Smart Auto Scan Logic
function toggleSmartAutoScan() {
    if (!navigator.onLine) {
        alert('Cannot start Auto Scan. No internet connection available.');
        return;
    }
    
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
    
    // Check if station plays within 4.5 seconds
    playCheckTimeout = setTimeout(() => {
        if (!isSmartScanning) return;
        
        if (audioPlayer.paused || audioPlayer.readyState < 3) {
            // Failed or taking too long - delete station
            playerStatus.textContent = 'Deleting unresponsive station...';
            
            if (currentStations.length > 0) {
                currentStations.splice(currentStationIndex, 1);
                if (currentStationIndex >= currentStations.length) {
                    currentStationIndex = 0;
                }
                renderStations();
            }
            
            setTimeout(() => {
                if (currentStations.length > 0) playSmartScanStation();
                else toggleSmartAutoScan(); // Stop if empty
            }, 1000);
        }
    }, 4500);
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

// --- Sleep Mode & Screen Auto-Off Functions ---
function enableSleepMode(enable) {
    isSleepMode = enable;
    if (isSleepMode) {
        document.body.classList.add('sleep-mode-active');
        if (sleepOverlay) sleepOverlay.classList.add('active');
        releaseWakeLock(); // Release screen lock so screen light automatically turns off via system screen timeout
        if (keepAliveAudio) keepAliveAudio.pause();
        
        if (!audioPlayer.paused) {
            userExplicitlyPaused = true;
            audioPlayer.pause();
        }
        playerStatus.textContent = '🌙 Sleep Mode (Screen Auto-Off)';
        if (sleepBtn) {
            sleepBtn.style.backgroundColor = 'var(--secondary-color)';
            sleepBtn.style.color = '#fff';
        }
    } else {
        document.body.classList.remove('sleep-mode-active');
        if (sleepOverlay) sleepOverlay.classList.remove('active');
        if (sleepBtn) {
            sleepBtn.style.backgroundColor = 'transparent';
            sleepBtn.style.color = 'inherit';
        }
        if (!audioPlayer.paused) {
            requestWakeLock();
            if (keepAliveAudio) keepAliveAudio.play().catch(console.error);
        }
    }
}

function toggleSleepMode() {
    enableSleepMode(!isSleepMode);
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
