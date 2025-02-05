module.exports = {
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js", // Utiliser notre propre Service Worker
      exclude: ["_redirects"], // Éviter les conflits
    },
  },
};
