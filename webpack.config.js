const path = require('path');
const {
  NODE_ENV = 'production',
} = process.env;


module.exports = {
    entry: './src/app.ts',
  //mode: 'NODE_ENV',
  mode: 'development',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  }
}