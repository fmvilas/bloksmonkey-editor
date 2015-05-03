module.exports = {
  entry: "./src/app/main.js",
  output: {
    filename: "./js/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: "jade" },
      { test: /\.json$/, loader: "json" }
    ]
  }
};
