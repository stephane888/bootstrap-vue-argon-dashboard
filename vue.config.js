const path = require("path");

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}
// vue.config.js
/**
 * @see https://cli.vuejs.org/config/#vue-config-js
 */
module.exports = {
  lintOnSave: true,
  configureWebpack: {
    // Set up all the aliases we use in our app.
    resolve: {
      alias: {
        assets: resolveSrc("src/assets"),
      },
    },
    //
    devtool: "source-map",
  },
  css: {
    // Enable CSS source maps.
    // sourceMap: process.env.NODE_ENV !== "production",
    sourceMap: true,
  },
  //
  // outputDir: "public",
  // productionSourceMap: true,
};
