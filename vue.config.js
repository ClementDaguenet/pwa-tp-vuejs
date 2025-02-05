const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: "/pwa-tp-vuejs/",
  devServer: {
    port: 5000,
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/serviceWorker.js",
      swDest: "service-worker.js",
      exclude: ["_redirects"],
    },
  },
});
