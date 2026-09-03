// ==========================================================================
// RKD FM | CYBER RADIO DECK ENGINE
// ==========================================================================

// API Configurations
const API_ENDPOINTS = [
    'https://de1.api.radio-browser.info/json',
    'https://at1.api.radio-browser.info/json',
    'https://nl1.api.radio-browser.info/json',
    'https://fr1.api.radio-browser.info/json'
];
let currentApiIndex = 0;
let API_BASE = API_ENDPOINTS[currentApiIndex];

const DEFAULT_LIMIT = 200;
const DEFAULT_LOGO = 'rkd_logo.png';

const CUSTOM_SINGER_STATIONS = [
    {
        stationuuid: 'custom-mohammed-rafi-radio',
        name: 'Mohammed Rafi Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodmohammedrafi/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/mohammed-rafi.jpg',
        country: 'India',
        tags: 'singer, mohammed rafi, hindi, classics, oldies',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-arijit-singh-radio',
        name: 'Arijit Singh Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodlove/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/arijit-singh.jpg',
        country: 'India',
        tags: 'singer, arijit singh, hindi, romantic, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-asha-bhosle-radio',
        name: 'Asha Bhosle Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodashabhosle/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/asha-bhosle.jpg',
        country: 'India',
        tags: 'singer, asha bhosle, hindi, classics, retro',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-alka-yagnik-radio',
        name: 'Alka Yagnik Radio',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodalkayagnik/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/alka-yagnik.jpg',
        country: 'India',
        tags: 'singer, alka yagnik, 90s, hindi, melodies',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-sonu-nigam-radio',
        name: 'Sonu Nigam Special',
        url_resolved: 'https://streaming.exclusive.radio/uber/bollywoodsonunigam/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/sonu-nigam.jpg',
        country: 'India',
        tags: 'singer, sonu nigam, hindi, romantic',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-vishal-shekhar-radio',
        name: 'Vishal Shekhar Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio?artist=vishalshekhar',
        favicon: 'logo.png',
        country: 'India',
        tags: 'singer, vishal shekhar, hindi, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-armaan-malik-radio',
        name: 'Armaan Malik Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio?artist=armaan',
        favicon: 'logo.png',
        country: 'India',
        tags: 'singer, armaan malik, hindi, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-neha-kakkar-radio',
        name: 'Neha Kakkar Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio?artist=neha',
        favicon: 'logo.png',
        country: 'India',
        tags: 'singer, neha kakkar, hindi, bollywood',
        lastcheckok: 1
    }
];

const CUSTOM_GHAZAL_STATIONS = [
    {
        stationuuid: 'custom-gazal-radio-london',
        name: 'Gazal Radio London',
        url_resolved: 'https://streaming.webhostnepal.com/8018/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/10/gazal-radio-london-uk.png',
        country: 'India',
        tags: 'ghazal, gazal, hindi, poetry, classic',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-gyansthali-896-fm',
        name: 'Radio Gyansthali 89.6 FM',
        url_resolved: 'https://streamasiacdn.atc-labs.com/gyansthali.aac',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radiogyansthali.jpg',
        country: 'India',
        tags: 'ghazal, gazal, gyansthali, 89.6 fm, hindi',
        lastcheckok: 1
    }
];

const CUSTOM_PUNJABI_STATIONS = [
    {
        stationuuid: 'custom-easy-punjabi-radio',
        name: 'Easy Punjabi Radio',
        url_resolved: 'https://ais-sa1.streamon.fm/7676_48k.aac',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        tags: 'punjabi, easy punjabi, pop, folk, ghazal',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-panjabi-ghazal',
        name: 'Radio Panjabi Ghazal & Folk',
        url_resolved: 'https://s20.reliastream.com/stream/8134',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-panjabi.jpg',
        country: 'India',
        tags: 'punjabi, ghazal, radio panjabi, folk, poetry',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-harman-radio-punjabi',
        name: 'Harman Radio Punjabi',
        url_resolved: 'http://harmanradio.net:8000/channel1_HQ.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/harman-radio.jpg',
        country: 'Australia',
        tags: 'punjabi, harman, folk, sikh, music',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-sher-e-punjab-radio',
        name: 'Sher E Punjab AM 600',
        url_resolved: 'https://ais-sa1.streamon.fm/7676_48k.aac',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/sher-e-punjab.jpg',
        country: 'Canada',
        tags: 'punjabi, sher e punjab, news, talk',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akash-radio-punjabi',
        name: 'Akash Radio Punjabi',
        url_resolved: 'http://c2.radioboss.fm:8276/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/akash-radio.jpg',
        country: 'UK',
        tags: 'punjabi, akash, asian, hits',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akash-radio-london-punjabi',
        name: 'Akash Radio London Punjabi',
        url_resolved: 'http://radio.canstream.co.uk:8161/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/akash-london.jpg',
        country: 'UK',
        tags: 'punjabi, akash london, asian',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-panj-punjabi',
        name: 'Radio Panj 1521AM',
        url_resolved: 'http://s3.voscast.com:11264/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-panj.jpg',
        country: 'UK',
        tags: 'punjabi, radio panj, asian, music',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-myradio-580am-punjabi',
        name: 'MyRadio 580 AM Punjabi',
        url_resolved: 'http://ais-sa1.streamon.fm/7681_64k.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/myradio-580.jpg',
        country: 'Canada',
        tags: 'punjabi, 580am, hindi, music',
        lastcheckok: 1
    }
];

const CUSTOM_BHAKTI_STATIONS = [
    {
        stationuuid: 'custom-shaiva-lahari',
        name: 'Shaiva Lahari',
        url_resolved: 'https://radio.shaivam.org/listen/shiva-tattvam/radio.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, shaiva, shiva, lahari, devotional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-2b-radio-sangam-ganesha',
        name: '2B! Radio Sangam Ganesha',
        url_resolved: 'http://radio2bindia.out.airtime.pro:8000/radio2bindia_a',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, ganesha, sangam, devotional, mantra',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-2b-radio-sangam-meditation',
        name: '2B! Radio Sangam Meditation',
        url_resolved: 'https://streaming.positivity.radio/pr/posimeditation/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, meditation, sangam, spiritual, peace',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-easy-96-radio',
        name: 'Easy 96 Radio',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        tags: 'bhakti, devotional, hindi, easy 96',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bhajans-radio-guyana',
        name: 'Bhajans Radio Guyana',
        url_resolved: 'https://s3.citrus3.com:8042/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/07/bhajan-radio-guyana.jpg',
        country: 'India',
        tags: 'bhakti, bhajans, guyana, devotional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bhaktisudha',
        name: 'Bhaktisudha',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodlove/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, bhaktisudha, devotional, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-2b-radio-sangam-shiva',
        name: '2B! Radio Sangam Shiva',
        url_resolved: 'http://hot.out.airtime.pro:8000/hot_a',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, shiva, sangam, spiritual',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bhakti-world-hanuman',
        name: 'Bhakti World - Hanuman',
        url_resolved: 'http://2bhanuman.out.airtime.pro:8000/2bhanuman_a',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, hanuman, devotional, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bhakti-world-media-shiva',
        name: 'Bhakti World Media - Shiva',
        url_resolved: 'https://radio.shaivam.org/listen/shiva-tattvam/radio.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, shiva, mantra, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bhakti-world-krishna',
        name: 'Bhakti World - Krishna',
        url_resolved: 'http://millenniumhits.out.airtime.pro:8000/millenniumhits_a',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bhakthisudha-hindi.jpg',
        country: 'India',
        tags: 'bhakti, krishna, sangeet, hindi',
        lastcheckok: 1
    }
];

const CUSTOM_HINDI_STATIONS = [
    {
        stationuuid: 'custom-easy-96-radio',
        name: 'Easy 96 Radio',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/easy-96-radio.jpg',
        country: 'India',
        tags: 'hindi, easy 96, pop, bollywood, bhakti',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-mirchi-hindi',
        name: 'Radio Mirchi Hindi',
        url_resolved: 'https://eu8.fastcast4u.com/proxy/clyedupq/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-mirchi-hindi.jpg',
        country: 'India',
        tags: 'hindi, bollywood, mirchi, top 40',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-mirchi-love',
        name: 'Mirchi Love Hindi',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodlove/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/mirchi-love-hindi.jpg',
        country: 'India',
        tags: 'hindi, romantic, love, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-red-fm-hindi',
        name: 'Red FM 93.5',
        url_resolved: 'https://funasia.streamguys1.com/live9',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/red-fm.jpg',
        country: 'India',
        tags: 'hindi, superhits, red fm, bajate raho',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-city-hindi',
        name: 'Radio City Hindi',
        url_resolved: 'http://162.244.80.118:9460/stream.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-city-hindi.jpg',
        country: 'India',
        tags: 'hindi, city, bollywood, hits',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-big-fm-hindi',
        name: '92.7 BIG FM',
        url_resolved: 'https://ice10.securenetsystems.net/CKYR',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/big-fm.jpg',
        country: 'India',
        tags: 'hindi, big fm, retro, classic',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-vividh-bharati',
        name: 'Vividh Bharati AIR',
        url_resolved: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'hindi, air, doordarshan, news, oldies',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-gold-fm',
        name: 'AIR FM Gold Hindi',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio011/hlspbaudio011_Auto.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'hindi, air gold, classics, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-one-hindi',
        name: '94.3 Radio One Hindi',
        url_resolved: 'https://streams.radio.co/s8d06d0298/listen',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-one-hindi.jpg',
        country: 'India',
        tags: 'hindi, radio one, retro, international',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-fever-104-fm',
        name: 'Fever 104 FM',
        url_resolved: 'https://radio.canstream.co.uk:8115/live.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/fever-104-fm.jpg',
        country: 'India',
        tags: 'hindi, fever 104, bollywood, pop',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-udaan-hindi',
        name: 'Radio Udaan Hindi',
        url_resolved: 'https://stream.radioudaan.com/listen/radio_udaan/radio.mp3',
        favicon: 'https://radioudaan.com/sites/default/files/Radioudaan%20small%202_0.png',
        country: 'India',
        tags: 'hindi, radio udaan, talk, music, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-24-hindi',
        name: 'Radio 24 Hindi',
        url_resolved: 'https://s7.everestcast.com:1155/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-24.jpg',
        country: 'India',
        tags: 'hindi, radio 24, hits, pop, classics',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bollywood-2010s',
        name: 'Bollywood 2010s Hits',
        url_resolved: 'https://drive.uber.radio/uber/bollywood2010s/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bollywood-hits.jpg',
        country: 'India',
        tags: 'hindi, bollywood, 2010s, romantic, pop',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-maharani',
        name: 'Radio Maharani',
        url_resolved: 'https://streamasiacdn.atc-labs.com/radiomaharani.aac',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-maharani.jpg',
        country: 'India',
        tags: 'hindi, maharani, classic, folk, melodies',
        lastcheckok: 1
    }
];

const CUSTOM_AUSTRALIAN_NEWS_STATIONS = [
    {
        stationuuid: 'custom-abc-news-radio',
        name: 'ABC NewsRadio Australia',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/PBW/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/ABC_NewsRadio_logo.svg/512px-ABC_NewsRadio_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, abc, newsradio, fm, english',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-abc-radio-national',
        name: 'ABC Radio National (RN)',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/2RN/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ABC_RN_logo.svg/512px-ABC_RN_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, politics, culture, abc',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-2gb-873-sydney',
        name: '2GB News Talk 873 AM Sydney',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/2GB/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2GB_logo.svg/512px-2GB_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, sydney, 2gb',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-702-abc-sydney',
        name: '702 ABC Radio News Sydney',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/2BL/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ABC_RN_logo.svg/512px-ABC_RN_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, sydney, abc',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-774-abc-melbourne',
        name: '774 ABC Radio News Melbourne',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/3LO/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ABC_RN_logo.svg/512px-ABC_RN_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, melbourne, abc',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-612-abc-brisbane',
        name: '612 ABC Radio News Brisbane',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/4QR/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ABC_RN_logo.svg/512px-ABC_RN_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, brisbane, abc',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-720-abc-perth',
        name: '720 ABC Radio News Perth',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/6WF/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ABC_RN_logo.svg/512px-ABC_RN_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, perth, abc',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-891-abc-adelaide',
        name: '891 ABC Radio News Adelaide',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/5AN/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/ABC_RN_logo.svg/512px-ABC_RN_logo.svg.png',
        country: 'Australia',
        tags: 'news, australia news, talk, adelaide, abc',
        lastcheckok: 1
    }
];

const CUSTOM_EURO_NEWS_STATIONS = [
    {
        stationuuid: 'custom-france-info-fm',
        name: 'France Info 105.5 FM',
        url_resolved: 'https://icecast.radiofrance.fr/franceinfo-midfi.mp3',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/France_Info_logo_2016.svg/512px-France_Info_logo_2016.svg.png',
        country: 'France',
        tags: 'news, euro news, france, french, 24/7 news',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bbc-world-service-euro',
        name: 'BBC World Service Europe',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC_World_Service_2022.svg/512px-BBC_World_Service_2022.svg.png',
        country: 'UK',
        tags: 'news, euro news, bbc, uk, global news',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-rai-radio1-italy',
        name: 'Rai Radio 1 News Italy',
        url_resolved: 'https://icestreaming.rai.it/1.mp3',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rai_Radio_1_logo.svg/512px-Rai_Radio_1_logo.svg.png',
        country: 'Italy',
        tags: 'news, euro news, italy, rai, italian',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-rte-radio1-ireland',
        name: 'RTÉ Radio 1 News Ireland',
        url_resolved: 'https://icecast2.rte.ie/radio1',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/RT%C3%89_Radio_1_logo.svg/512px-RT%C3%89_Radio_1_logo.svg.png',
        country: 'Ireland',
        tags: 'news, euro news, ireland, english, rte',
        lastcheckok: 1
    }
];

const CUSTOM_BBC_UK_NEWS_STATIONS = [
    {
        stationuuid: 'custom-bbc-world-service-uk',
        name: 'BBC World Service UK',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC_World_Service_2022.svg/512px-BBC_World_Service_2022.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, british, bbc, news, world service',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bbc-radio-4-news',
        name: 'BBC Radio 4 News & Speech',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BBC_Radio_4_2022.svg/512px-BBC_Radio_4_2022.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, british, radio 4, news, talk, politics',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bbc-radio-5-live',
        name: 'BBC Radio 5 Live News & Sport',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/BBC_Radio_5_Live_2022.svg/512px-BBC_Radio_5_Live_2022.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, british, 5 live, news, sport, talk',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-lbc-uk-news-973',
        name: 'LBC UK News & Talk 97.3 FM',
        url_resolved: 'https://icecast.globalht.com/LBCUK',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/LBC_logo_2014.svg/512px-LBC_logo_2014.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, british, lbc, london, news, talk',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-lbc-news-247',
        name: 'LBC News 24/7 UK',
        url_resolved: 'https://icecast.globalht.com/LBCNews',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/LBC_logo_2014.svg/512px-LBC_logo_2014.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, british, lbc news, rolling news, talk',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bbc-radio-scotland-news',
        name: 'BBC Radio Scotland News',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_scotland_fm',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/BBC_Radio_Scotland_2022.svg/512px-BBC_Radio_Scotland_2022.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, scotland, british, news, talk',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bbc-radio-wales-news',
        name: 'BBC Radio Wales News',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_wales_fm',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/BBC_Radio_Wales_2022.svg/512px-BBC_Radio_Wales_2022.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, wales, british, news, talk',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bbc-radio-ulster-news',
        name: 'BBC Radio Ulster News',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/BBC_Radio_Ulster_2022.svg/512px-BBC_Radio_Ulster_2022.svg.png',
        country: 'UK',
        tags: 'bbc news, uk news, ulster, ireland, british, news',
        lastcheckok: 1
    }
];

const CUSTOM_US_NEWS_STATIONS = [
];

const CUSTOM_WORLD_NEWS_STATIONS = [
    {
        stationuuid: 'custom-srf-4-news-switzerland',
        name: 'SRF 4 News Switzerland',
        url_resolved: 'https://stream.srg-ssr.ch/m/srf4news/mp3_128',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/SRF_4_News_logo.svg/512px-SRF_4_News_logo.svg.png',
        country: 'Switzerland',
        tags: 'world news, global news, srf, switzerland, europe, news',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-sweden-news',
        name: 'Radio Sweden News',
        url_resolved: 'https://sverigesradio.se/topsy/direkt/sraudio/2562.mp3',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Sveriges_Radio_logo.svg/512px-Sveriges_Radio_logo.svg.png',
        country: 'Sweden',
        tags: 'world news, global news, radio sweden, sweden, news, english',
        lastcheckok: 1
    }
];

const CUSTOM_GLOBAL_POP_STATIONS = [
    {
        stationuuid: 'custom-bbc-radio-1-uk',
        name: 'BBC Radio 1 Pop Hits UK',
        url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/BBC_Radio_1_2021.svg/512px-BBC_Radio_1_2021.svg.png',
        country: 'UK',
        tags: 'pop, top40, hits, uk, bbc, radio 1',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-capital-fm-london',
        name: 'Capital FM 95.8 London Pop',
        url_resolved: 'https://icecast.globalht.com/CapitalUK',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Capital_FM_logo.svg/512px-Capital_FM_logo.svg.png',
        country: 'UK',
        tags: 'pop, top40, hit music, london, capital fm',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-1046-rtl-berlin-pop',
        name: '104.6 RTL Berlin Pop Hits',
        url_resolved: 'https://stream.104.6rtl.com/rtl-live/mp3-128',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/RTL_Group_logo_2021.svg/512px-RTL_Group_logo_2021.svg.png',
        country: 'Germany',
        tags: 'pop, top40, rtl, berlin, germany',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-nova-969-sydney-pop',
        name: 'Nova 96.9 FM Sydney Pop',
        url_resolved: 'https://live-radio01.mediahubaustralia.com/2SYD/mp3/',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Nova_Entertainment_logo.svg/512px-Nova_Entertainment_logo.svg.png',
        country: 'Australia',
        tags: 'pop, top40, nova, sydney, australia',
        lastcheckok: 1
    }
];

const CUSTOM_NEWS_STATIONS = [
    {
        stationuuid: 'custom-republic-bharat-tv',
        name: 'Republic Bharat TV',
        url_resolved: 'https://streams.tangotv.in/REPUBLICBHARAT/ORIGIN/index.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Republic_Bharat_Logo.svg/512px-Republic_Bharat_Logo.svg.png',
        country: 'India',
        tags: 'news, tv, hindi, republic bharat',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-zee-news',
        name: 'Zee News',
        url_resolved: 'https://dknttpxmr0dwf.cloudfront.net/index_57.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Zee_News_logo.svg/512px-Zee_News_logo.svg.png',
        country: 'India',
        tags: 'news, tv, hindi, zee news',
        lastcheckok: 1
    },
    {
        stationuuid: 'dd-national',
        name: 'DD National HD',
        url_resolved: 'https://mumt01.tangotv.in/O5aw8Zn3DDNATIONALHD/index.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/DD_National.svg/512px-DD_National.svg.png',
        country: 'India',
        tags: 'tv, doordarshan, hindi, news',
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
        stationuuid: 'dd-india',
        name: 'DD India',
        url_resolved: 'https://d2gvyg6lvauoko.cloudfront.net/230226/ddindia/chunks.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/DD_India_logo.svg/512px-DD_India_logo.svg.png',
        country: 'India',
        tags: 'tv, doordarshan, hindi, news',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-delhi-fm-gold',
        name: 'AIR Delhi FM Gold',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'news, air, delhi, fm gold',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-news-247',
        name: 'AIR News 24/7',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio00264kbps.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'news, air, 24/7, live news',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-delhi-indraprastha',
        name: 'AIR DELHI INDRAPRASTHA',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio002_Auto.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'news, air, delhi, indraprastha',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-warangal',
        name: 'Akashvani Warangal',
        url_resolved: 'https://radio.wavespb.com/live/deae7120a205bfff/deae7120a205bfff.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'news, akashvani, warangal, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-anantapur',
        name: 'Akashvani Anantapur',
        url_resolved: 'https://radio.wavespb.com/live/3bcd83926d6c3cca/3bcd83926d6c3cca.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'news, akashvani, anantapur, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-nizamabad',
        name: 'Akashvani Nizamabad',
        url_resolved: 'https://radio.wavespb.com/live/5d9989b5189a8f4a/5d9989b5189a8f4a.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'news, akashvani, nizamabad, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-wion-live-tv',
        name: 'WION LIVE TV',
        url_resolved: 'https://d7x8z4yuq42qn.cloudfront.net/index_3.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/WION_Logo.svg/512px-WION_Logo.svg.png',
        country: 'India',
        tags: 'news, tv, english, wion',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-vividh-bharati',
        name: 'AIR Vividh Bharati',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=vividh',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, vividh bharati, hindi, entertainment',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-mumbai',
        name: 'Akashvani Mumbai',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=mumbai',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, mumbai, marathi, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-chennai',
        name: 'Akashvani Chennai',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=chennai',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, chennai, tamil, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-bengaluru',
        name: 'Akashvani Bengaluru',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=bengaluru',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, bengaluru, kannada, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-hyderabad',
        name: 'Akashvani Hyderabad',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=hyderabad',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, hyderabad, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-hyderabad-a',
        name: 'AIR Hyderabad A',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=hyd_a',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, hyderabad, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-tirupati',
        name: 'Akashvani Tirupati',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=tirupati',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, tirupati, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-kothagudem',
        name: 'Akashvani Kothagudem',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=kothagudem',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, kothagudem, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-kadapa',
        name: 'Akashvani Kadapa',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=kadapa',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, kadapa, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-visakhapatnam',
        name: 'Akashvani Visakhapatnam',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=visakhapatnam',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, visakhapatnam, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-markapur',
        name: 'Akashvani Markapur',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=markapur',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, akashvani, markapur, telugu, regional',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-rainbow-delhi',
        name: 'AIR FM Rainbow Delhi',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=rainbow_delhi',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, rainbow fm, delhi, hindi, entertainment',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-rainbow-mumbai',
        name: 'AIR FM Rainbow Mumbai',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=rainbow_mumbai',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, rainbow fm, mumbai, marathi, hindi',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-rainbow-chennai',
        name: 'AIR FM Rainbow Chennai',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=rainbow_chennai',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, rainbow fm, chennai, tamil',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-rainbow-bengaluru',
        name: 'AIR FM Rainbow Bengaluru',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=rainbow_bengaluru',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, rainbow fm, bengaluru, kannada',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-rainbow-hyderabad',
        name: 'AIR FM Rainbow Hyderabad',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8?station=rainbow_hyderabad',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'air, rainbow fm, hyderabad, telugu',
        lastcheckok: 1
    }
];

const CUSTOM_BANGLA_STATIONS = [
    {
        stationuuid: 'custom-air-kolkata-geetanjali',
        name: 'AIR Kolkata Geetanjali',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio055/hlspbaudio05564kbps.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'bangla, kolkata, geetanjali, air, all india radio, news, music',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-fm-gold-kolkata',
        name: 'AIR FM Gold Kolkata',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio057/hlspbaudio05764kbps.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'bangla, air fm gold, kolkata, classics, oldies, news',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-fm-rainbow-kolkata',
        name: 'Akashvani FM Rainbow Kolkata',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio058/hlspbaudio05864kbps.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'bangla, fm rainbow, kolkata, music, pop, entertainment',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-bangla-net',
        name: 'Radio Bangla Net',
        url_resolved: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SP_R3563475_SC',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/radio-bangla-net.jpg',
        country: 'India',
        tags: 'bangla, radio bangla net, music, kolkata, hits',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-air-akashvani-maitree-kolkata',
        name: 'AIR Akashvani Maitree Kolkata',
        url_resolved: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio245/hlspbaudio24564kbps.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'bangla, maitree, kolkata, air, news, culture',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-akashvani-siliguri',
        name: 'Akashvani Siliguri',
        url_resolved: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio164/playlist.m3u8',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/All_India_Radio_logo.svg/512px-All_India_Radio_logo.svg.png',
        country: 'India',
        tags: 'bangla, siliguri, akashvani, regional, news, music',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-mixify-bengali-hits',
        name: 'Mixify Bengali Hits',
        url_resolved: 'https://server.mixify.in/listen/bangla/radio.mp3',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/mixify-bengali.jpg',
        country: 'India',
        tags: 'bangla, mixify, bengali, hits, pop, classic',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-hot-now-bangla',
        name: 'Hot Now Bangla',
        url_resolved: 'https://stream.radiotreetal.com/listen',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/hot-now-bangla.jpg',
        country: 'India',
        tags: 'bangla, hot now, bengali, entertainment, music',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-radio-bongonet-robichhaya',
        name: 'Radio BongOnet Robichhaya',
        url_resolved: 'http://radio.rudeep.ru:8000/stream',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/robichhaya.jpg',
        country: 'India',
        tags: 'bangla, rabindra sangeet, robichhaya, bengali, classic',
        lastcheckok: 1
    }
];

const CUSTOM_DJ_REMIX_STATIONS = [
    {
        stationuuid: 'custom-bollywood-beyond',
        name: 'Bollywood Beyond',
        url_resolved: 'https://s6.yesstreaming.net/proxy/john1237?mp=/live',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bollywood-beyond.jpg',
        country: 'India',
        tags: 'dj remix, remix, bollywood beyond, dance, party',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bollywood-workout',
        name: 'Bollywood Workout',
        url_resolved: 'https://drive.uber.radio/uber/bollywoodworkout/icecast.audio',
        favicon: 'https://onlineradiohub.com/wp-content/uploads/2023/06/bollywood-workout.jpg',
        country: 'India',
        tags: 'dj remix, remix, workout, fitness, high energy, bollywood',
        lastcheckok: 1
    },
    {
        stationuuid: 'custom-bombaybeats',
        name: 'Bombaybeats',
        url_resolved: 'https://strmreg.1.fm/bombaybeats_mobile_mp3',
        favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/1.FM_Logo.svg/512px-1.FM_Logo.svg.png',
        country: 'India',
        tags: 'dj remix, remix, bombaybeats, 1.fm, dance, hits',
        lastcheckok: 1
    }
];

// Application State
let currentStations = [];
let currentPlaylist = (JSON.parse(localStorage.getItem('fm_playlist')) || []).filter(s => {
    const name = (s.name || '').toLowerCase();
    const tags = (s.tags || '').toLowerCase();
    return !name.includes('jesus') && !tags.includes('jesus');
});
let currentStationIndex = -1;
let currentSource = 'search';
let currentMode = 'India';
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
let sleepTimerId = null;
let currentVolumeLevel = 30;

// Web Audio API Audio Engine (+80% Sound Effect Boost Pipeline)
let audioCtx = null;
let sourceNode = null;
let masterGainNode = null;
let djBassFilter = null;
let eqHdTrebleFilter = null;
let eqHdMidFilter = null;
let surroundDelayNode = null;
let surroundFeedbackGain = null;

function initAudioEngine() {
    if (audioCtx) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        audioCtx = new AudioContextClass();

        // 1. Media Element Source Node
        sourceNode = audioCtx.createMediaElementSource(audioPlayer);

        // 2. DJ Boost Node: Low-shelf filter (+8.0 dB = +80% low frequency amplitude boost @ 120Hz)
        djBassFilter = audioCtx.createBiquadFilter();
        djBassFilter.type = 'lowshelf';
        djBassFilter.frequency.value = 120;
        djBassFilter.gain.value = 0;

        // 3. HD / EQ Nodes: High-shelf filter (+8.0 dB treble shelf) & Peaking filter (+4.5 dB clarity)
        eqHdTrebleFilter = audioCtx.createBiquadFilter();
        eqHdTrebleFilter.type = 'highshelf';
        eqHdTrebleFilter.frequency.value = 3200;
        eqHdTrebleFilter.gain.value = 0;

        eqHdMidFilter = audioCtx.createBiquadFilter();
        eqHdMidFilter.type = 'peaking';
        eqHdMidFilter.frequency.value = 1800;
        eqHdMidFilter.Q.value = 1.2;
        eqHdMidFilter.gain.value = 0;

        // 4. 3D Surround Nodes: Spatial Delay line (+80% soundstage width / depth)
        surroundDelayNode = audioCtx.createDelay();
        surroundDelayNode.delayTime.value = 0.025; // 25ms 3D separation

        surroundFeedbackGain = audioCtx.createGain();
        surroundFeedbackGain.gain.value = 0;

        // 5. Master Gain Node (1.8x = +80% Volume Output Boost when Vol-Boost is checked)
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.value = currentVolumeLevel / 100;

        // Connect Processing Graph:
        // source -> djBass -> eqHdTreble -> eqHdMid -> masterGain -> destination
        sourceNode.connect(djBassFilter);
        djBassFilter.connect(eqHdTrebleFilter);
        eqHdTrebleFilter.connect(eqHdMidFilter);
        eqHdMidFilter.connect(masterGainNode);

        // Parallel 3D Surround Spatial Routing
        eqHdMidFilter.connect(surroundDelayNode);
        surroundDelayNode.connect(surroundFeedbackGain);
        surroundFeedbackGain.connect(masterGainNode);

        masterGainNode.connect(audioCtx.destination);
    } catch (err) {
        console.warn('Web Audio Engine init note:', err);
    }
}

function ensureAudioContextResumed() {
    initAudioEngine();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.log(e));
    }
}

function applyAudioFXSettings() {
    ensureAudioContextResumed();
    const currTime = audioCtx ? audioCtx.currentTime : 0;

    // 1. Master Volume & Vol-Boost (+80% Gain Multiplier Boost -> 1.8x Gain)
    let baseGain = (currentVolumeLevel / 100);
    let targetGain = isVolBoostEnabled ? baseGain * 1.8 : baseGain;

    if (masterGainNode && audioCtx) {
        masterGainNode.gain.setTargetAtTime(targetGain, currTime, 0.05);
    } else {
        // Fallback for HTML5 audio volume
        audioPlayer.volume = Math.min(1.0, isVolBoostEnabled ? Math.min(1.0, baseGain * 1.8) : baseGain);
    }

    // 2. DJ Boost (+80% Bass Punch = +8.0 dB Low Shelf Filter)
    if (djBassFilter && audioCtx) {
        const bassDb = isDJBoostEnabled ? 8.0 : 0.0;
        djBassFilter.gain.setTargetAtTime(bassDb, currTime, 0.05);
    }

    // 3. HD / EQ (+80% Sound Clarity = +8.0 dB Treble Shelf & +4.5 dB Mid Clarity)
    if (eqHdTrebleFilter && eqHdMidFilter && audioCtx) {
        const trebleDb = isHDEQEnabled ? 8.0 : 0.0;
        const midDb = isHDEQEnabled ? 4.5 : 0.0;
        eqHdTrebleFilter.gain.setTargetAtTime(trebleDb, currTime, 0.05);
        eqHdMidFilter.gain.setTargetAtTime(midDb, currTime, 0.05);
    }

    // 4. 3D Surround (+80% Spatial soundstage depth / width)
    if (surroundFeedbackGain && audioCtx) {
        const surroundVal = is3DSurroundEnabled ? 0.80 : 0.0;
        surroundFeedbackGain.gain.setTargetAtTime(surroundVal, currTime, 0.05);
    }
}

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
let hlsInstance = null;
const keepAliveAudio = document.getElementById('keep-alive-audio');
const stationsGrid = document.getElementById('stations-grid');
const searchInput = document.getElementById('station-search');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const modeToggleText = document.getElementById('mode-toggle-text');
const modeToggleIcon = document.getElementById('mode-toggle-icon');
const categoriesBar = document.getElementById('categories-bar');
const indiaCats = document.getElementById('india-cats');
const globalCats = document.getElementById('global-cats');
const catButtons = document.querySelectorAll('.cat-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playerStatus = document.getElementById('player-status');
const currentStationName = document.getElementById('current-station-name');
const currentStationMeta = document.getElementById('current-station-meta');
const currentStationImg = document.getElementById('current-station-info-img');
const addToPlaylistBtn = document.getElementById('add-to-playlist-btn');
const favHeartIcon = document.getElementById('fav-heart-icon');
const resultsCount = document.getElementById('results-count');
const mainLoader = document.getElementById('main-loader');
const nowPlayingCard = document.querySelector('.now-playing-card');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const tabRefreshBtn = document.getElementById('tab-refresh-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const eqHdBtn = document.getElementById('eq-hd-btn');
const djBoostBtn = document.getElementById('dj-boost-btn');
const surround3dBtn = document.getElementById('3d-surround-btn');
const volBoostCheck = document.getElementById('vol-boost-check-input');
const smartAutoScanBtn = document.getElementById('smart-auto-scan-btn');

const mainTabs = document.querySelectorAll('.tab-btn:not(.action-btn)');
const views = {
    discovery: document.getElementById('discovery-view'),
    playlist: document.getElementById('playlist-view')
};
const quickPlaylistList = document.getElementById('quick-playlist-list');
const fullPlaylistList = document.getElementById('full-playlist-list');
const playlistCountBadge = document.getElementById('playlist-count-badge');
const quickFavCount = document.getElementById('quick-fav-count');

const sleepTimerBtn = document.getElementById('sleep-timer-btn');
const sleepTimerMenu = document.getElementById('sleep-timer-menu');
const timerBadge = document.getElementById('timer-badge');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');

// Hero Volume Drag Overlay DOM Elements & State
const heroVolOverlay = document.getElementById('hero-volume-overlay');
const heroVolText = document.getElementById('hero-volume-text');

let isDraggingHeroVol = false;
let volDragStartX = 0;
let volDragStartValue = 30;
let volHudTimeout = null;

function showHeroVolumeHUD(value) {
    if (!heroVolOverlay || !heroVolText) return;
    heroVolText.textContent = `${value}%`;
    heroVolOverlay.classList.add('visible');

    clearTimeout(volHudTimeout);
    volHudTimeout = setTimeout(() => {
        if (!isDraggingHeroVol) {
            heroVolOverlay.classList.remove('visible');
        }
    }, 1200);
}

function setupHeroVolumeDrag() {
    const heroSec = document.getElementById('hero-section') || document.querySelector('.hero-section');
    if (!heroSec) return;

    let volDragStartY = 0;
    let scrollStartTop = 0;
    let dragDirectionLocked = null; // 'horizontal' | 'vertical' | null

    // Mouse Drag
    heroSec.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, a, label, .viz-btn, .fav-heart-btn')) {
            return;
        }
        isDraggingHeroVol = true;
        dragDirectionLocked = null;
        volDragStartX = e.clientX;
        volDragStartY = e.clientY;
        scrollStartTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        volDragStartValue = currentVolumeLevel;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingHeroVol) return;

        const deltaX = e.clientX - volDragStartX;
        const deltaY = e.clientY - volDragStartY;

        if (!dragDirectionLocked) {
            if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
                if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                    dragDirectionLocked = 'horizontal';
                    if (heroSec) heroSec.classList.add('is-dragging-vol');
                    updateVolume(volDragStartValue, true);
                } else {
                    dragDirectionLocked = 'vertical';
                }
            }
        }

        if (dragDirectionLocked === 'horizontal') {
            e.preventDefault();
            const volChange = Math.round(deltaX * 0.35);
            let newVol = Math.min(100, Math.max(0, volDragStartValue + volChange));
            updateVolume(newVol, true);
        } else if (dragDirectionLocked === 'vertical') {
            window.scrollTo(0, scrollStartTop - deltaY);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingHeroVol) {
            isDraggingHeroVol = false;
            dragDirectionLocked = null;
            if (heroSec) heroSec.classList.remove('is-dragging-vol');
            volHudTimeout = setTimeout(() => {
                if (heroVolOverlay) heroVolOverlay.classList.remove('visible');
            }, 1000);
        }
    });

    // Touch Drag
    heroSec.addEventListener('touchstart', (e) => {
        if (e.target.closest('button, input, a, label, .viz-btn, .fav-heart-btn')) {
            return;
        }
        if (e.touches.length === 1) {
            isDraggingHeroVol = true;
            dragDirectionLocked = null;
            volDragStartX = e.touches[0].clientX;
            volDragStartY = e.touches[0].clientY;
            volDragStartValue = currentVolumeLevel;
        }
    }, { passive: true });

    heroSec.addEventListener('touchmove', (e) => {
        if (!isDraggingHeroVol || e.touches.length !== 1) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - volDragStartX;
        const deltaY = currentY - volDragStartY;

        if (!dragDirectionLocked) {
            if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
                if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                    dragDirectionLocked = 'horizontal';
                    if (heroSec) heroSec.classList.add('is-dragging-vol');
                    updateVolume(volDragStartValue, true);
                } else {
                    dragDirectionLocked = 'vertical';
                }
            }
        }

        if (dragDirectionLocked === 'horizontal') {
            if (e.cancelable) e.preventDefault();
            const volChange = Math.round(deltaX * 0.35);
            let newVol = Math.min(100, Math.max(0, volDragStartValue + volChange));
            updateVolume(newVol, true);
        }
    }, { passive: false });

    const endTouch = () => {
        if (isDraggingHeroVol) {
            isDraggingHeroVol = false;
            dragDirectionLocked = null;
            if (heroSec) heroSec.classList.remove('is-dragging-vol');
            volHudTimeout = setTimeout(() => {
                if (heroVolOverlay) heroVolOverlay.classList.remove('visible');
            }, 1000);
        }
    };

    heroSec.addEventListener('touchend', endTouch);
    heroSec.addEventListener('touchcancel', endTouch);
}

// Initialize Application
function init() {
    setupEventListeners();
    setupStationAudioAura();
    setupHeroVolumeDrag();
    fetchStations('', 'India');
    renderPlaylist();
    updateVolume(30);
    loadTheme();
    setupStatusObserver();
}

function setupStatusObserver() {
    const statusObserver = new MutationObserver(() => {
        const text = playerStatus.textContent.toLowerCase();

        if (text.includes('buffer') || text.includes('load') || text.includes('scan') || text.includes('tune')) {
            playerStatus.style.color = 'var(--gold-accent)';
            playerStatus.style.background = 'rgba(245, 158, 11, 0.15)';
            playerStatus.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            playerStatus.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.3)';
        } else if (text.includes('play')) {
            playerStatus.style.color = 'var(--emerald-accent)';
            playerStatus.style.background = 'rgba(16, 185, 129, 0.15)';
            playerStatus.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            playerStatus.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.3)';
        } else if (text.includes('pause') || text.includes('stop') || text.includes('error') || text.includes('fail') || text.includes('stall')) {
            playerStatus.style.color = 'var(--accent-color)';
            playerStatus.style.background = 'rgba(236, 72, 153, 0.15)';
            playerStatus.style.borderColor = 'rgba(236, 72, 153, 0.3)';
            playerStatus.style.boxShadow = '0 0 12px rgba(236, 72, 153, 0.3)';
        } else {
            playerStatus.style.color = 'var(--cyan-accent)';
            playerStatus.style.background = 'rgba(6, 182, 212, 0.15)';
            playerStatus.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            playerStatus.style.boxShadow = '0 0 12px rgba(6, 182, 212, 0.3)';
        }
    });
    statusObserver.observe(playerStatus, { childList: true, characterData: true, subtree: true });
}

function showToast(message, icon = 'info') {
    // Disabled all button click notifications/popups as requested
    return;
}

function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('input', () => {
        clearSearchBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
    });
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        fetchStations('', currentMode === 'India' ? 'India' : '');
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    function performSearch() {
        const query = searchInput.value.trim();
        const country = currentMode === 'India' ? 'India' : '';
        fetchStations(query, country);
        switchView('discovery');
    }

    // Mode Toggle (India / Global)
    modeToggleBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        if (currentMode === 'India') {
            currentMode = 'Global';
            modeToggleText.textContent = 'Global';
            if (modeToggleIcon) modeToggleIcon.textContent = '🌍';
            modeToggleBtn.classList.remove('india-active');
            indiaCats.style.display = 'none';
            globalCats.style.display = 'flex';
            fetchStations('', '');
            showToast('Switched to Global Mode', 'globe');
        } else {
            currentMode = 'India';
            modeToggleText.textContent = 'India';
            if (modeToggleIcon) modeToggleIcon.textContent = '🇮🇳';
            modeToggleBtn.classList.add('india-active');
            globalCats.style.display = 'none';
            indiaCats.style.display = 'flex';
            fetchStations('', 'India');
            showToast('Switched to India Mode', 'flag');
        }
        updateActiveCat('All');
        switchView('discovery');
    });

    // Categories
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            const country = currentMode === 'India' ? 'India' : '';
            fetchStations('', country, tag, true);
            updateActiveCat(btn.textContent);
            switchView('discovery');
        });
    });

    // Drag category scroll
    let isDown = false;
    let startX, scrollLeft;
    categoriesBar.addEventListener('mousedown', (e) => {
        isDown = true;
        categoriesBar.style.cursor = 'grabbing';
        startX = e.pageX - categoriesBar.offsetLeft;
        scrollLeft = categoriesBar.scrollLeft;
    });
    categoriesBar.addEventListener('mouseleave', () => { isDown = false; categoriesBar.style.cursor = 'grab'; });
    categoriesBar.addEventListener('mouseup', () => { isDown = false; categoriesBar.style.cursor = 'grab'; });
    categoriesBar.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - categoriesBar.offsetLeft;
        const walk = (x - startX) * 2;
        categoriesBar.scrollLeft = scrollLeft - walk;
    });

    // Refresh button
    if (tabRefreshBtn) {
        tabRefreshBtn.addEventListener('click', () => fetchStations(lastQuery, lastCountry, lastTag));
    }

    // Fullscreen
    const handleFSChange = () => {
        const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        const fsIcon = document.getElementById('fullscreen-icon');
        if (isFS) {
            document.body.classList.add('is-fullscreen');
            if (fsIcon) fsIcon.setAttribute('data-lucide', 'minimize');
        } else {
            document.body.classList.remove('is-fullscreen');
            if (fsIcon) fsIcon.setAttribute('data-lucide', 'maximize');
        }
        if (window.lucide) lucide.createIcons();
    };

    // Fullscreen Toggle Helper
    const toggleFullscreen = () => {
        const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        if (!isFS) {
            const el = document.documentElement;
            const reqFS = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (reqFS) reqFS.call(el).catch(err => console.log(err));
        } else {
            const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            if (exitFS) exitFS.call(document);
        }
    };

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Double click window / hero section to toggle fullscreen
    document.addEventListener('dblclick', (e) => {
        if (e.target.closest('input, textarea, select, button, a, label, .fav-heart-btn')) {
            return;
        }
        e.preventDefault();
        toggleFullscreen();
    });

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
        document.addEventListener(evt, handleFSChange);
    });

    // View Switcher (Grid / List)
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            stationsGrid.classList.add('grid-layout');
        });
        listViewBtn.addEventListener('click', () => {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            stationsGrid.classList.remove('grid-layout');
        });
    }

    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Playback Controls
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);

    // Playlist Add / Heart Button
    addToPlaylistBtn.addEventListener('click', () => {
        if (currentStationIndex >= 0 && currentStations[currentStationIndex]) {
            togglePlaylistStation(currentStations[currentStationIndex]);
        }
    });

    // FX Toggles
    if (eqHdBtn) eqHdBtn.addEventListener('click', toggleHDEQ);
    if (djBoostBtn) djBoostBtn.addEventListener('click', toggleDJBoost);
    if (surround3dBtn) surround3dBtn.addEventListener('click', toggle3DSurround);
    if (volBoostCheck) volBoostCheck.addEventListener('change', toggleVolBoost);
    if (smartAutoScanBtn) smartAutoScanBtn.addEventListener('click', toggleSmartAutoScan);

    // Sleep Timer
    if (sleepTimerBtn && sleepTimerMenu) {
        sleepTimerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sleepTimerMenu.style.display = sleepTimerMenu.style.display === 'none' ? 'flex' : 'none';
        });
        document.addEventListener('click', () => { sleepTimerMenu.style.display = 'none'; });

        const timerOpts = sleepTimerMenu.querySelectorAll('.timer-opt');
        timerOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                timerOpts.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const mins = parseInt(opt.dataset.minutes);
                setSleepTimer(mins);
            });
        });
    }



    // Main Tabs
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.tab));
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        switch (e.code) {
            case 'Space': e.preventDefault(); togglePlay(); break;
            case 'ArrowUp': e.preventDefault(); updateVolume(Math.min(100, currentVolumeLevel + 5), true); break;
            case 'ArrowDown': e.preventDefault(); updateVolume(Math.max(0, currentVolumeLevel - 5), true); break;
            case 'ArrowLeft': e.preventDefault(); playPrevious(); break;
            case 'ArrowRight': e.preventDefault(); playNext(); break;
        }
    });

    // Audio Event Handlers
    audioPlayer.onplay = () => {
        ensureAudioContextResumed();
        applyAudioFXSettings();
        playPauseBtn.innerHTML = '<i data-lucide="pause" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Playing';
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        requestWakeLock();
        if (keepAliveAudio) keepAliveAudio.play().catch(e => console.log(e));
    };

    audioPlayer.onplaying = () => {
        consecutiveErrors = 0;
        if (playCheckTimeout) {
            clearTimeout(playCheckTimeout);
            playCheckTimeout = null;
        }
        if (nowPlayingCard) nowPlayingCard.classList.add('playing');
        playerStatus.textContent = 'Playing';
    };

    audioPlayer.onpause = () => {
        if (playCheckTimeout) {
            clearTimeout(playCheckTimeout);
            playCheckTimeout = null;
        }
        playPauseBtn.innerHTML = '<i data-lucide="play" id="play-icon"></i>';
        lucide.createIcons();
        playerStatus.textContent = 'Paused';
        if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
        releaseWakeLock();
        if (keepAliveAudio) keepAliveAudio.pause();
    };

    audioPlayer.onerror = () => {
        if (playCheckTimeout) {
            clearTimeout(playCheckTimeout);
            playCheckTimeout = null;
        }
        consecutiveErrors++;
        if (consecutiveErrors < 8) {
            playerStatus.textContent = 'Stream Error - Auto reconnecting...';
            setTimeout(() => playNext(), 1500);
        } else {
            playerStatus.textContent = 'Playback Error';
            if (nowPlayingCard) nowPlayingCard.classList.remove('playing');
            consecutiveErrors = 0;
        }
    };
}

// Fetch Stations

async function fetchStations(query = '', country = '', tag = '', autoPlay = false) {
    lastQuery = query;
    lastCountry = country;
    lastTag = tag;

    mainLoader.style.display = 'flex';
    stationsGrid.innerHTML = '';

    let url = `${API_BASE}/stations/search?limit=${DEFAULT_LIMIT}&order=clickcount&reverse=true&hidebroken=true`;
    if (country) url += `&country=${encodeURIComponent(country)}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    if (query) url += `&name=${encodeURIComponent(query)}`;

    try {
        const lowerTag = tag.toLowerCase();
        const lowerQuery = query.toLowerCase();

        if (lowerTag === 'ghazal' || lowerTag === 'gazal' || lowerQuery.includes('ghazal') || lowerQuery.includes('gazal')) {
            currentStations = [...CUSTOM_GHAZAL_STATIONS];
        } else if (lowerTag === 'punjabi' || lowerTag === 'panjabi' || lowerQuery.includes('punjabi') || lowerQuery.includes('panjabi')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_PUNJABI_STATIONS, ...resp];
        } else if (lowerTag === 'bangla' || lowerTag === 'bengali' || lowerQuery.includes('bangla') || lowerQuery.includes('bengali')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_BANGLA_STATIONS, ...resp];
        } else if (lowerTag === 'dj remix' || lowerTag === 'remix' || lowerQuery.includes('remix') || lowerQuery.includes('dj')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_DJ_REMIX_STATIONS, ...resp];
        } else if (lowerTag === 'singer' || lowerQuery.includes('singer')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_SINGER_STATIONS, ...resp];
        } else if (lowerTag === 'hindi' || lowerQuery === 'hindi') {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_HINDI_STATIONS, ...resp];
        } else if (lowerTag === 'classic' || lowerTag === 'old' || lowerTag === 'retro' || lowerQuery.includes('classic') || lowerQuery.includes('old') || lowerQuery.includes('retro')) {
            const allCustom = [...CUSTOM_HINDI_STATIONS, ...CUSTOM_BANGLA_STATIONS, ...CUSTOM_NEWS_STATIONS, ...CUSTOM_BHAKTI_STATIONS, ...CUSTOM_SINGER_STATIONS, ...CUSTOM_GHAZAL_STATIONS, ...CUSTOM_PUNJABI_STATIONS, ...CUSTOM_DJ_REMIX_STATIONS];
            const classicCustom = allCustom.filter(s => {
                if (!s.tags) return false;
                const t = s.tags.toLowerCase();
                return t.includes('classic') || t.includes('old') || t.includes('retro');
            });
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...classicCustom, ...resp];
        } else if (lowerTag === 'air' || lowerTag === 'all india radio' || lowerTag === 'akashvani' || lowerTag.includes('rainbow') || lowerQuery === 'air' || lowerQuery.includes('all india radio') || lowerQuery.includes('akashvani') || lowerQuery.includes('rainbow')) {
            const allCustom = [...CUSTOM_HINDI_STATIONS, ...CUSTOM_BANGLA_STATIONS, ...CUSTOM_NEWS_STATIONS, ...CUSTOM_BHAKTI_STATIONS, ...CUSTOM_SINGER_STATIONS, ...CUSTOM_GHAZAL_STATIONS, ...CUSTOM_PUNJABI_STATIONS, ...CUSTOM_DJ_REMIX_STATIONS];
            const airCustom = allCustom.filter(s => {
                if (!s.tags) return false;
                const t = s.tags.toLowerCase();
                return t.includes('air') || t.includes('all india radio') || t.includes('akashvani') || t.includes('rainbow');
            });
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...airCustom, ...resp];
        } else if (lowerTag === 'bhakti' || lowerTag === 'devotional' || lowerQuery.includes('bhakti')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_BHAKTI_STATIONS, ...resp];
        } else if (lowerTag === 'pop' || lowerQuery.includes('pop')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_GLOBAL_POP_STATIONS, ...resp];
        } else if (lowerTag === 'world news' || lowerQuery.includes('world news')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_WORLD_NEWS_STATIONS, ...CUSTOM_BBC_UK_NEWS_STATIONS, ...CUSTOM_EURO_NEWS_STATIONS, ...CUSTOM_US_NEWS_STATIONS, ...CUSTOM_AUSTRALIAN_NEWS_STATIONS, ...resp];
        } else if (lowerTag.includes('us ') || lowerTag === 'us news' || lowerQuery.includes('us news') || lowerTag.includes('usa')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_US_NEWS_STATIONS, ...resp];
        } else if (lowerTag.includes('bbc') || lowerTag.includes('uk') || lowerTag.includes('british') || lowerQuery.includes('bbc')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_BBC_UK_NEWS_STATIONS, ...resp];
        } else if (lowerTag.includes('australia') || lowerQuery.includes('australia')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_AUSTRALIAN_NEWS_STATIONS, ...resp];
        } else if (lowerTag.includes('euro') || lowerQuery.includes('euro')) {
            const resp = await fetch(url).then(r => r.json()).catch(() => []);
            currentStations = [...CUSTOM_EURO_NEWS_STATIONS, ...resp];
        } else if (lowerTag.includes('news') || lowerQuery.includes('news')) {
            if (country === 'India' || currentMode === 'India') {
                currentStations = [...CUSTOM_NEWS_STATIONS];
            } else {
                const resp = await fetch(url).then(r => r.json()).catch(() => []);
                currentStations = [...CUSTOM_WORLD_NEWS_STATIONS, ...CUSTOM_US_NEWS_STATIONS, ...CUSTOM_BBC_UK_NEWS_STATIONS, ...CUSTOM_AUSTRALIAN_NEWS_STATIONS, ...CUSTOM_EURO_NEWS_STATIONS, ...CUSTOM_NEWS_STATIONS, ...resp];
            }
        } else {
            const response = await fetch(url);
            const apiRes = await response.json().catch(() => []);
            if (country === 'India' || currentMode === 'India') {
                const allCustom = [...CUSTOM_HINDI_STATIONS, ...CUSTOM_BANGLA_STATIONS, ...CUSTOM_NEWS_STATIONS, ...CUSTOM_BHAKTI_STATIONS, ...CUSTOM_SINGER_STATIONS, ...CUSTOM_GHAZAL_STATIONS, ...CUSTOM_PUNJABI_STATIONS, ...CUSTOM_DJ_REMIX_STATIONS];
                if (query || tag) {
                    const matchedCustom = allCustom.filter(s => {
                        let matchQ = true;
                        let matchT = true;
                        if (query) {
                            matchQ = (s.name && s.name.toLowerCase().includes(lowerQuery)) || (s.tags && s.tags.toLowerCase().includes(lowerQuery));
                        }
                        if (tag) {
                            matchT = s.tags && s.tags.toLowerCase().includes(lowerTag);
                        }
                        return matchQ && matchT;
                    });
                    currentStations = [...matchedCustom, ...apiRes];
                } else {
                    currentStations = [...allCustom, ...apiRes];
                }
            } else {
                currentStations = apiRes;
            }
        }

        // Enforce STRICT Active Station Filtering (lastcheckok === 1), Unique Channel Verification, and Block List
        const seenNames = new Set();
        const seenUrls = new Set();
        currentStations = currentStations.filter(station => {
            if (!station) return false;
            // Only include active stations verified by server check
            if (station.lastcheckok !== 1 && station.lastcheckok !== undefined) return false;

            const rawName = station.name || '';
            const rawTags = station.tags || '';
            // Block Jesus Radio and any Jesus-related stations
            if (rawName.toLowerCase().includes('jesus') || rawTags.toLowerCase().includes('jesus')) {
                return false;
            }

            // Exclude London, Bangladesh, and China radio stations in India mode
            if (currentMode === 'India' || country === 'India') {
                const sCountry = (station.country || '').toLowerCase();
                const sName = (station.name || '').toLowerCase();
                const sTags = (station.tags || '').toLowerCase();

                // Explicit exception for Gazal Radio London
                if (sName !== 'gazal radio london' && sName !== 'gazal radio london uk') {
                    if (sCountry.includes('bangladesh') || sCountry.includes('china') || sCountry.includes('uk') || sCountry.includes('united kingdom')) {
                        return false;
                    }
                    if (sName.includes('bangladesh') || sName.includes('china') || sName.includes('london') || sName.includes('landon') || sName.includes('chinese')) {
                        return false;
                    }
                    if (sTags.includes('bangladesh') || sTags.includes('china') || sTags.includes('london')) {
                        return false;
                    }
                }
            }

            const streamUrl = station.url_resolved || station.url;
            if (!streamUrl || typeof streamUrl !== 'string' || !streamUrl.trim()) return false;

            const normName = station.name ? station.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
            const normUrl = streamUrl.trim().toLowerCase();

            if (normName && seenNames.has(normName)) return false;
            if (seenUrls.has(normUrl)) return false;

            if (normName) seenNames.add(normName);
            seenUrls.add(normUrl);

            return true;
        });
        renderStations();
        resultsCount.textContent = `${currentStations.length} stations found`;

        if (currentStations.length > 0) {
            if (autoPlay) {
                playStation(0, 'search');
            } else {
                currentStationIndex = 0;
                updatePlayerUI(currentStations[0]);
                playerStatus.textContent = 'Ready';
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
        stationsGrid.innerHTML = '<div class="empty-state"><p>Unable to connect to radio server. Retrying...</p></div>';
    } finally {
        mainLoader.style.display = 'none';
    }
}

// Render Stations Grid
function renderStations() {
    if (currentStations.length === 0) {
        stationsGrid.innerHTML = '<div class="empty-state"><i data-lucide="radio"></i><p>No stations found for this selection.</p></div>';
        return;
    }

    stationsGrid.innerHTML = currentStations.map((station, index) => {
        const isFav = currentPlaylist.some(s => s.stationuuid === station.stationuuid);
        const nameUpper = (station.name || '').toUpperCase();
        return `
            <div class="station-item ${currentStationIndex === index && currentSource === 'search' ? 'active' : ''}" onclick="playStation(${index}, 'search', this)">
                <img src="${station.favicon || DEFAULT_LOGO}" class="list-img" loading="eager" onerror="this.src='${DEFAULT_LOGO}';">
                <div class="item-info">
                    <h4>${nameUpper}</h4>
                    <p>${station.country || 'Global'} • ${station.tags ? station.tags.split(',')[0] : 'FM'}</p>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick="event.stopPropagation(); togglePlaylistById('${station.stationuuid}')" title="${isFav ? 'Remove Favorite' : 'Add Favorite'}">
                        <i data-lucide="${isFav ? 'heart' : 'plus-circle'}" style="${isFav ? 'color: var(--accent-color)' : ''}"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    updateQueueInfo();
    lucide.createIcons();
}

function renderPlaylist() {
    const isFavEmpty = currentPlaylist.length === 0;
    const playlistHTML = isFavEmpty
        ? `<div class="empty-state"><i data-lucide="list-music"></i><p>No favorite stations saved</p></div>`
        : currentPlaylist.map((station, index) => {
            const nameUpper = (station.name || '').toUpperCase();
            return `
            <div class="station-item" onclick="playStation(${index}, 'playlist', this)">
                <img src="${station.favicon || DEFAULT_LOGO}" class="list-img" loading="eager" onerror="this.src='${DEFAULT_LOGO}';">
                <div class="item-info">
                    <h4>${nameUpper}</h4>
                    <p>${station.country || 'Custom Station'}</p>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick="event.stopPropagation(); removeFromPlaylist(${index})">
                        <i data-lucide="trash-2" style="color: var(--accent-color)"></i>
                    </button>
                </div>
            </div>
        `;
        }).join('');

    if (quickPlaylistList) quickPlaylistList.innerHTML = playlistHTML;
    if (fullPlaylistList) fullPlaylistList.innerHTML = playlistHTML;
    if (playlistCountBadge) playlistCountBadge.textContent = currentPlaylist.length;
    if (quickFavCount) quickFavCount.textContent = `${currentPlaylist.length} items`;

    updateQueueInfo();
    lucide.createIcons();
}

function switchView(target) {
    mainTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === target);
    });
    Object.keys(views).forEach(key => {
        if (views[key]) views[key].style.display = key === target ? 'block' : 'none';
    });
}

// Playback Engine - Instant Super Fast Radio Playback
function playStation(index, source = 'search', element = null) {
    ensureAudioContextResumed();
    currentSource = source;
    const list = source === 'search' ? currentStations : currentPlaylist;
    const station = list[index];
    if (!station) return;

    currentStationIndex = index;
    updatePlayerUI(station);

    const streamUrl = station.url_resolved || station.url;
    if (!streamUrl) return;

    // Clear existing play check timeout if any
    if (playCheckTimeout) {
        clearTimeout(playCheckTimeout);
        playCheckTimeout = null;
    }

    // Set 4.5 second auto-skip timeout if station does not start playing
    playCheckTimeout = setTimeout(() => {
        if (audioPlayer.paused || audioPlayer.currentTime === 0 || audioPlayer.readyState < 3) {
            console.warn('Station did not play within 4.5 seconds. Auto-skipping to next station...');
            if (playerStatus) playerStatus.textContent = 'Stream Timeout - Playing Next...';
            playNext();
        }
    }, 4500);

    // Instant status and visual feedback
    if (playerStatus) playerStatus.textContent = 'Connecting...';
    if (nowPlayingCard) nowPlayingCard.classList.add('playing');
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i data-lucide="pause" id="play-icon"></i>';
        if (window.lucide) lucide.createIcons();
    }

    // Configure fast audio player attributes
    audioPlayer.preload = 'auto';
    audioPlayer.autoplay = true;

    // Destroy existing HLS instance if any
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }

    // Fast HLS Stream (.m3u8) Playback Optimization
    if (streamUrl.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
        hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 10,
            maxBufferLength: 3,
            maxMaxBufferLength: 6,
            liveSyncDurationCount: 2,
            liveMaxLatencyDurationCount: 4,
            startFragPrefetch: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(audioPlayer);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            audioPlayer.play().catch(e => console.warn('Autoplay error:', e));
        });
        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hlsInstance.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hlsInstance.recoverMediaError();
                        break;
                    default:
                        hlsInstance.destroy();
                        hlsInstance = null;
                        audioPlayer.src = streamUrl;
                        audioPlayer.play().catch(e => console.warn('Direct fallback error:', e));
                        break;
                }
            }
        });
    } else {
        audioPlayer.src = streamUrl;
        audioPlayer.play().catch(e => {
            console.warn('Autoplay blocked:', e);
            if (playerStatus) playerStatus.textContent = 'Click Play to Listen';
        });
    }

    const items = document.querySelectorAll('.station-item');
    items.forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');
}


function updateQueueInfo() {
    const queuePrevItem = document.getElementById('queue-prev-item');
    const queueNextItem = document.getElementById('queue-next-item');
    const queuePrevName = document.getElementById('queue-prev-name');
    const queueNextName = document.getElementById('queue-next-name');

    const list = currentSource === 'search' ? currentStations : currentPlaylist;
    if (!list || list.length === 0) {
        if (queuePrevName) queuePrevName.textContent = '--';
        if (queueNextName) queueNextName.textContent = '--';
        return;
    }

    const idx = (currentStationIndex >= 0 && currentStationIndex < list.length) ? currentStationIndex : 0;
    const prevIndex = (idx - 1 + list.length) % list.length;
    const nextIndex = (idx + 1) % list.length;

    const prevStation = list[prevIndex];
    const nextStation = list[nextIndex];

    if (queuePrevName) queuePrevName.textContent = prevStation ? prevStation.name.toUpperCase() : '--';
    if (queueNextName) queueNextName.textContent = nextStation ? nextStation.name.toUpperCase() : '--';

    // Reset rotation state: start with NEXT showing first
    showingNextInQueue = true;
    if (queueNextItem && queuePrevItem) {
        queueNextItem.style.display = 'inline-flex';
        queuePrevItem.style.display = 'none';
    }

    // Set 3-second alternating toggle interval
    if (queueTickerInterval) clearInterval(queueTickerInterval);
    queueTickerInterval = setInterval(() => {
        showingNextInQueue = !showingNextInQueue;
        if (queueNextItem && queuePrevItem) {
            if (showingNextInQueue) {
                queueNextItem.style.display = 'inline-flex';
                queuePrevItem.style.display = 'none';
            } else {
                queueNextItem.style.display = 'none';
                queuePrevItem.style.display = 'inline-flex';
            }
        }
    }, 3000);
}

function updatePlayerUI(station) {
    const name = (station.name || 'Unknown Station').toUpperCase();
    const country = station.country || 'Global';
    const tags = station.tags ? station.tags.split(',').slice(0, 2).join(', ') : 'FM Radio';
    const img = station.favicon || DEFAULT_LOGO;

    if (currentStationName) currentStationName.textContent = name;
    if (currentStationMeta) currentStationMeta.textContent = `${country} • ${tags}`;
    if (currentStationImg) {
        currentStationImg.src = img;
        currentStationImg.onerror = () => { currentStationImg.src = DEFAULT_LOGO; };
    }

    const isFav = currentPlaylist.some(s => s.stationuuid === station.stationuuid);
    if (favHeartIcon) {
        favHeartIcon.setAttribute('data-lucide', isFav ? 'heart' : 'heart-off');
        if (addToPlaylistBtn) {
            addToPlaylistBtn.style.color = isFav ? 'var(--accent-color)' : '#fff';
        }
    }
    updateQueueInfo();
    lucide.createIcons();
}

function togglePlay() {
    ensureAudioContextResumed();
    if (audioPlayer.paused) {
        if (!audioPlayer.src && currentStations.length > 0) {
            playStation(0, 'search');
        } else if (audioPlayer.src) {
            audioPlayer.play().catch(e => console.warn(e));
        }
    } else {
        audioPlayer.pause();
    }
}

function playNext() {
    const list = currentSource === 'search' ? currentStations : currentPlaylist;
    if (list.length === 0) return;
    currentStationIndex = (currentStationIndex + 1) % list.length;
    playStation(currentStationIndex, currentSource);
}

function playPrevious() {
    const list = currentSource === 'search' ? currentStations : currentPlaylist;
    if (list.length === 0) return;
    currentStationIndex = (currentStationIndex - 1 + list.length) % list.length;
    playStation(currentStationIndex, currentSource);
}

// Volume Controls
function updateVolume(value, showHUD = false) {
    currentVolumeLevel = Math.min(100, Math.max(0, parseInt(value) || 0));
    applyAudioFXSettings();

    if (showHUD && typeof showHeroVolumeHUD === 'function') {
        showHeroVolumeHUD(currentVolumeLevel);
    }
}

// Playlist Functions
function togglePlaylistStation(station) {
    const index = currentPlaylist.findIndex(s => s.stationuuid === station.stationuuid);
    if (index > -1) {
        currentPlaylist.splice(index, 1);
        showToast('Removed from Favorites', 'trash-2');
    } else {
        currentPlaylist.push(station);
        showToast('Saved to Favorites', 'heart');
    }
    localStorage.setItem('fm_playlist', JSON.stringify(currentPlaylist));
    renderPlaylist();
    updatePlayerUI(station);
}

function togglePlaylistById(uuid) {
    const station = currentStations.find(s => s.stationuuid === uuid);
    if (station) togglePlaylistStation(station);
}

function removeFromPlaylist(index) {
    currentPlaylist.splice(index, 1);
    localStorage.setItem('fm_playlist', JSON.stringify(currentPlaylist));
    renderPlaylist();
    showToast('Removed from Favorites', 'trash-2');
}

function updateActiveCat(label) {
    catButtons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent === label);
    });
}

// Theme
function toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('fm_theme', theme);
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', theme === 'light' ? 'sun' : 'moon');
        lucide.createIcons();
    }
}

function loadTheme() {
    setTheme(localStorage.getItem('fm_theme') || 'dark');
}

// FX Toggles with Sound Effect Boost Pipeline
function toggleHDEQ() {
    isHDEQEnabled = !isHDEQEnabled;
    eqHdBtn.classList.toggle('active', isHDEQEnabled);
    applyAudioFXSettings();
    showToast(isHDEQEnabled ? 'HD Audio & EQ Active' : 'HD Audio Off', 'sliders');
}

function toggleDJBoost() {
    isDJBoostEnabled = !isDJBoostEnabled;
    djBoostBtn.classList.toggle('active', isDJBoostEnabled);
    applyAudioFXSettings();
    showToast(isDJBoostEnabled ? 'DJ Beats Boost Active' : 'DJ Boost Off', 'zap');
}

function toggle3DSurround() {
    is3DSurroundEnabled = !is3DSurroundEnabled;
    surround3dBtn.classList.toggle('active', is3DSurroundEnabled);
    applyAudioFXSettings();
    showToast(is3DSurroundEnabled ? '3D Surround Active' : '3D Sound Off', 'disc');
}

function toggleVolBoost(e) {
    isVolBoostEnabled = e.target.checked;
    const volCheckContainer = e.target.closest('.vol-boost-check');
    if (volCheckContainer) {
        volCheckContainer.classList.toggle('active', isVolBoostEnabled);
    }
    applyAudioFXSettings();
    showToast(isVolBoostEnabled ? 'Volume Boost ON' : 'Volume Boost OFF', 'volume-2');
}

function toggleSmartAutoScan() {
    isSmartScanning = !isSmartScanning;
    if (isSmartScanning) {
        smartAutoScanBtn.innerHTML = '<i data-lucide="stop-circle"></i><span>Stop Scan</span>';
        smartAutoScanBtn.style.background = 'var(--accent-color)';
        smartAutoScanBtn.style.color = '#fff';
        lucide.createIcons();
        showToast('Auto Scan Started', 'zap');
        playSmartScanStation();
    } else {
        smartAutoScanBtn.innerHTML = '<i data-lucide="zap"></i><span>Auto Scan</span>';
        smartAutoScanBtn.style.background = '';
        smartAutoScanBtn.style.color = '';
        lucide.createIcons();
        clearTimeout(smartScanTimeout);
        showToast('Auto Scan Stopped', 'stop-circle');
    }
}

function playSmartScanStation() {
    if (!isSmartScanning || currentStations.length === 0) return;
    currentStationIndex = (currentStationIndex + 1) % currentStations.length;
    playStation(currentStationIndex, 'search');
    smartScanTimeout = setTimeout(() => playSmartScanStation(), 7000);
}

// Sleep Timer Logic
function setSleepTimer(minutes) {
    if (sleepTimerId) clearTimeout(sleepTimerId);
    if (minutes === 0) {
        timerBadge.style.display = 'none';
        showToast('Sleep Timer Off', 'clock');
        return;
    }
    timerBadge.style.display = 'block';
    timerBadge.textContent = `${minutes}m`;
    showToast(`Sleep Timer set to ${minutes} min`, 'clock');

    sleepTimerId = setTimeout(() => {
        audioPlayer.pause();
        timerBadge.style.display = 'none';
        showToast('Radio paused by Sleep Timer', 'moon');
    }, minutes * 60 * 1000);
}

// Wake Lock
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) { console.log(e); }
}

function releaseWakeLock() {
    if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

// Dynamic Station Audio Background Light Aura Render Loop
function setupStationAudioAura() {
    const stationAudioAura = document.getElementById('station-audio-aura');
    if (!stationAudioAura) return;

    function animateAura() {
        requestAnimationFrame(animateAura);
        if (document.body.getAttribute('data-theme') === 'light') {
            stationAudioAura.style.display = 'none';
            return;
        }
        stationAudioAura.style.display = 'block';

        const isPlaying = !audioPlayer.paused && audioPlayer.readyState >= 3;
        if (isPlaying) {
            const time = Date.now() * 0.004;
            const pulse = 1 + Math.abs(Math.sin(time * 6) * Math.cos(time * 3)) * 0.22;
            const blur = 16 + pulse * 14;
            const opacity = 0.5 + pulse * 0.45;
            const hueShift = (time * 60) % 360;

            stationAudioAura.style.transform = `scale(${pulse})`;
            stationAudioAura.style.filter = `blur(${blur}px)`;
            stationAudioAura.style.opacity = opacity;
            stationAudioAura.style.background = `radial-gradient(circle, hsl(${hueShift}, 100%, 60%) 0%, hsl(${(hueShift + 60) % 360}, 100%, 55%) 50%, hsl(${(hueShift + 120) % 360}, 100%, 50%) 100%)`;
        } else {
            stationAudioAura.style.transform = 'scale(0.95)';
            stationAudioAura.style.filter = 'blur(12px)';
            stationAudioAura.style.opacity = '0.2';
        }
    }

    animateAura();
}

// Toggle discovery grid & playlist sections
function toggleBothSections(btn) {
    const stations = document.getElementById('stations-grid');
    const playlist = document.getElementById('quick-playlist-list');
    if (!stations || !playlist) return;

    if (stations.style.display === 'none') {
        stations.style.display = stations.classList.contains('grid-layout') ? 'grid' : 'flex';
        playlist.style.display = 'flex';
        if (btn) btn.innerHTML = '<i data-lucide="chevron-down"></i>';
    } else {
        stations.style.display = 'none';
        playlist.style.display = 'none';
        if (btn) btn.innerHTML = '<i data-lucide="chevron-up"></i>';
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Start
init();
