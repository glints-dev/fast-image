const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src"),

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "@glints/fast-image",
    libraryTarget: "umd",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      { test: /\.(ts|js)x?$/, loader: "babel-loader", exclude: /node_modules/ },
    ],
  },

  plugins: [new ForkTsCheckerWebpackPlugin()],

  externals: {
    react: "react",
    "react-dom": "ReactDOM",
  },
};
