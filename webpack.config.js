var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: "./src/app/main.js",
  output: {
    filename: "./js/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: "jade" },
      { test: /\.json$/, loader: "json" },
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
      { test: /\.png$/, loader: "url-loader?name=[path][name].[ext]&context=./src&limit=100000&mimetype=image/png" }
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/styles.css")
  ]
};
