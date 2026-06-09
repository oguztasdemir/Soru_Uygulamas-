const CACHE_NAME = 'ml-app-v7';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'ml/notes.js',
  'gai/notes.js',
  'ds/notes.js',
  'isg/notes.js',
  'ml/questions.json',
  'gai/questions.json',
  'ds/questions.json',
  'isg/questions.json',
  'isg/tips_questions.json',
  'ml/cards.json',
  'gai/cards.json',
  'ds/cards.json',
  'isg/cards.json',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
