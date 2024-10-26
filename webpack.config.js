module.exports = {
  "output": {
    "filename": "index.bundle.js"
  },
  "resolve": {
    "extensions": [
      ".js",
      ".jsx"
    ],
    "alias": {}
  },
  "module": {
    "rules": [
      {
        "test": /\.(js|jsx)$/,
        "exclude": /node_modules/,
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              "@babel/preset-env",
              "@babel/preset-react"
            ]
          }
        }
      }
    ]
  },
  "entry": {
    "index": "./index.js"
  },
  devServer: {
    static: {
      directory: __dirname,
    },
    hot: true,
  },
}
