const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/serviceWorker.js",
      swDest: "service-worker.js",
      exclude: ["_redirects"],
    },
  },
});
