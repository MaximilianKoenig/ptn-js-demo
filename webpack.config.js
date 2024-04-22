const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const SOURCE_VERSION = process.env.SOURCE_VERSION || process.env.npm_package_gitHead || "dev";

module.exports = (env) => {
  let outputPath = __dirname + "/dist";
  let path = "src";
  let mode = "development";
  return {
    entry: {
      bundle: [`./${path}/index.js`],
    },
    output: {
      path: outputPath,
      filename: "index.js",
    },
    module: {
      rules: [
        {
          test: /\.xml$/,
          use: ["raw-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "**/*.{html,css,woff,ttf,eot,svg,woff2,ico}",
            context: `${path}/`,
          },
        ],
      }),
      new webpack.DefinePlugin({
        "process.env.SOURCE_VERSION": JSON.stringify(SOURCE_VERSION || null),
      }),
    ],
    mode,
    devtool: "source-map",
  }
}
