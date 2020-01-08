const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
    login: './src/login.js',
    modal: './src/modal.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Memo-To-Trello',
      template: 'src/index.pug',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: 'Login',
      template: 'src/login.pug',
      filename: 'login.html',
      chunks: ['login']
    }),
    new HtmlWebpackPlugin({
      title: 'Modal',
      template: 'src/modal.pug',
      filename: 'modal.html',
      chunks: ['modal']
    }),
    new CopyPlugin([
      'src/main.css'
    ])
  ]
}
