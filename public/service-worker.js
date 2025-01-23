self.addEventListener("push", function (e) {
  const options = {
    body: e.data.text(), // Notification
    icon: "/img/icons/favicon-16x16.png", // Icon
    data: { url: e.data.text() }, // URL
  };

  e.waitUntil(
    self.registration.showNotification("Adikeo App", options) // Title
  );
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url) // Open app when clicking notification
  );
});
