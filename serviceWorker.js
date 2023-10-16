self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/scripts/auth.js',
        '/sdk/js-sdk-master/dist/pocketbase.es.js',
        // Add other assets here
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ... rest of your code ...

self.addEventListener('message', (event) => {
  const { title, body } = event.data;
  showNotification(title, body);
});

function showNotification(title, body) {
  const options = {
      body,
      icon: "bearavatar.png"
  };

  self.registration.showNotification(title, options);
  console.log("notification");
}

// ... rest of your code ...
