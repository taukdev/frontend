// webpack.config.js
module.exports = {
  // other config...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/react-datepicker/, // suppress the warnings
        ],
      },
    ],
    
  },
};
