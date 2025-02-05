import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createI18n } from "vue-i18n";
import { en } from "./locales/en-us.lang";
import { fr } from "./locales/fr-fr.lang";
import "maplibre-gl/dist/maplibre-gl.css";

const storedLang = localStorage.getItem("language") || "en";
const i18n = createI18n({
  legacy: false,
  locale: storedLang,
  messages: { fr, en },
});

createApp(App).use(router).use(i18n).mount("#app");

// Check of service worker activity
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Successfully saved Service Worker :", registration);
      })
      .catch((error) => {
        console.log("Error while saving Service Worker :", error);
      });
  });
}

// Ask to client to active notifications
const askNotificationPermission = () => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    });
  }
};
askNotificationPermission();
