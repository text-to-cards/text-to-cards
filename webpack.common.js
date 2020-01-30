const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    main: './src/index.js',
    modal: './src/modal.js',
    login: './src/login.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          {
            use: ['pug-loader']
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
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
      title: 'Add cards',
      template: 'src/modal.pug',
      filename: 'modal.html',
      chunks: ['modal']
    }),
    new HtmlWebpackPlugin({
      title: 'Authorize Memo-to-Trello',
      template: 'src/login.pug',
      filename: 'login.html',
      chunks: ['login']
    }),
    new CopyPlugin([
      'src/main.css'
    ]),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
