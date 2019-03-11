// Service Worker

// Listen for push Notifications
self.addEventListener('push', e => {
    self.registration.showNotification(e.data.text());
});