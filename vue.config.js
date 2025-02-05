const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: "/adikeo/",
  devServer: {
    port: 61459,
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
