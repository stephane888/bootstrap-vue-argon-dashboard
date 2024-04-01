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
        assets: resolveSrc("src/assets")
      }
    },
    //
    devtool: "source-map"
  },
  // chainWebpack: (config) => {
  //   if (config && config.module)
  //     config.module.rule("eslint").use("eslint-loader").options({
  //       fix: true
  //     });
  // },
  css: {
    // Enable CSS source maps.
    // sourceMap: process.env.NODE_ENV !== "production",
    sourceMap: true
  },
  devServer: {
    client: {
      overlay: {
        // errors: true,
        // warnings: false,
        // runtimeErrors: true
        errors: false,
        warnings: false,
        runtimeErrors: false
      }
    }
  }
  //
  // outputDir: "public",
  // productionSourceMap: true,
};

// const envModeDev = process.env.NODE_ENV !== "production";
// module.exports = {
//   lintOnSave: true,
//   chainWebpack: (config) => {
//     config.module.rule("eslint").use("eslint-loader").options({
//       fix: true,
//     });
//   },
//   //------------https://cli.vuejs.org/config--------------//
//   //publicPath: "/",
//   //outputDir: "dist",
//   assetsDir: envModeDev ? "" : "./",
//   //Pour desactiver la generation des fichiers avec des valeurs aleatoires.
//   //filenameHashing: true,
//   //pour construire une app avec plusieurs pages.
//   //pages:undefined,
//   css: {
//     sourceMap: envModeDev ? false : false,
//     /*
//     loaderOptions: {
//       css: {
//         // options here will be passed to css-loader
//       },
//       postcss: {
//         // options here will be passed to postcss-loader
//       }
//     }
//     /**/
//   },
// };
