const CACHE = 'maximuebles-v1';
const ARCHIVOS = [
  '/MAXIMUEBLESJO/index2.html',
  '/MAXIMUEBLESJO/manifest.json',
  '/MAXIMUEBLESJO/icon-192.png',
  '/MAXIMUEBLESJO/icon-512.png'
];

// Instalar - guardar archivos en caché
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// Activar - limpiar cachés viejos
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch - servir desde caché si no hay internet
self.addEventListener('fetch', function(e){
  e.respondWith(
    fetch(e.request)
      .then(function(response){
        // Guardar copia fresca en caché
        var copy = response.clone();
        caches.open(CACHE).then(function(cache){
          cache.put(e.request, copy);
        });
        return response;
      })
      .catch(function(){
        // Sin internet: usar caché
        return caches.match(e.request);
      })
  );
});
