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
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      { test: /\.png$/, loader: "url-loader?name=[path][name].[ext]&context=./src&limit=100000&mimetype=image/png" },
      { test: /\.gif$/, loader: "url-loader?name=[path][name].[ext]&context=./src&limit=100000&mimetype=image/gif" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?name=assets/fonts/[name].[ext]&limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?name=assets/fonts/[name].[ext]&limit=10000" },
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' },
      { test: /underscore\.js$/, loader: 'expose?_' },
      { test: /backbone\.js$/, loader: 'expose?Backbone' },
      { test: /backbone\.marionette\.js$/, loader: 'expose?Marionette' },
      { test: /is_js/, loader: "imports?define=>undefined" } // Workaround for is.js, see: https://github.com/arasatasaygin/is.js/issues/100
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/styles.css")
  ]
};
