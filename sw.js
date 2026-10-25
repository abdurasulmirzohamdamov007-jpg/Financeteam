/* FINANCE TEAM — service worker.
   Asosiy sahifa HAR DOIM avval internetdan olinadi (shuning uchun yangilanish darrov ko'rinadi);
   internet yo'q bo'lsa, oxirgi saqlangan nusxa ochiladi. Supabase va tashqi kutubxonalarga tegilmaydi. */
const CACHE = 'ft-shell-v1';
self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(['./','manifest.webmanifest','icon-192.png','icon-512.png']).catch(()=>{})));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=> Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=> self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return;
  if(req.mode === 'navigate'){
    e.respondWith(fetch(req).then(res=>{
      if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c=> c.put('./', copy)).catch(()=>{}); }
      return res;
    }).catch(()=> caches.match('./').then(hit=> hit || Response.error())));
    return;
  }
  e.respondWith(caches.match(req).then(hit=> hit || fetch(req).then(res=>{
    if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c=> c.put(req, copy)).catch(()=>{}); }
    return res;
  })));
});
