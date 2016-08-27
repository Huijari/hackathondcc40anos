const cacheName = 'ClassPictures-1';
const filesToCache = [];

self.addEventListener('install', e => {
  console.log('SW Install');
  e.waitUntil(caches.open(cacheName).then(cache => {
    console.log('SW Cache');
    return cache.addAll(filesToCache);
  }));
});
