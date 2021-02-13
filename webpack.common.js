const path = require("path");

module.exports = {
  entry: {
    backgroundPage: path.join(__dirname, "src/extension/backgroundPage.ts"),
    popup: path.join(__dirname, "src/Popup/index.tsx"),
    toolbar: path.join(__dirname, "src/toolbar/index.tsx"),
    content: path.join(__dirname, "src/extension/content.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // Creates style nodes from JS strings
          },
          {
            loader: "css-loader", // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // Compiles Sass to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@src": path.resolve(__dirname, "src/"),
    },
  },
};
