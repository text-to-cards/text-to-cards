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
      title: 'Text to Cards',
      template: 'src/templates/index.pug',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: 'Add cards',
      template: 'src/templates/modal.pug',
      filename: 'modal.html',
      chunks: ['modal']
    }),
    new HtmlWebpackPlugin({
      title: 'Authorize Text to Cards',
      template: 'src/templates/login.pug',
      filename: 'login.html',
      chunks: ['login']
    }),
    new CopyPlugin([
      'src/css/main.css',
      'src/img/text_to_cards_light.svg',
      'src/img/text_to_cards_dark.svg',
      'src/img/icon.png',
    ]),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
