var staticCacheName = 'project-v6'; //dynamic naming just in case we want to alert users of a new sw

self.addEventListener('install', function(event) {
    console.log("hi nate, added worker and caching statics");

//dynamic updates to static cache w/ incremental versions
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'project.html',
        'project.js',
        'https://free.currencyconverterapi.com/api/v5/currencies',
        'https://fonts.googleapis.com/css?family=Raleway',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
      ]);
    })
  );
});


//smart update of cache version on activate (remove stale cache eww!)
self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('project-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
              console.log("hi nate, we deleted that stale cache. youre welcome handsome");

          return caches.delete(cacheName);
        })
      );
    })
  );
});

//fetch responses
self.addEventListener('fetch', function(event) {

  var requestUrl = new URL(event.request.url);
  console.log(requestUrl);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/project.html'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


