var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  context: __dirname + "/src",
  entry: "./stuff/Stuff.js",
  output: {
    libraryTarget: "var",
    library: "Stuff",
    path: __dirname + "/build",
    filename: "Stuff.js"
  },
  plugins: [
    new UglifyJsPlugin()
  ]
}
