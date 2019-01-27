const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack           = require('webpack');
const path              = require('path');
const pkg               = require('../package.json');
const ver2              = `${pkg.version.split('.')[0]}.${pkg.version.split('.')[1]}`;


module.exports = (env, argv) => {

  const dev = argv.mode == 'development';

  return {

    context: path.resolve(__dirname, '../'),

    entry: {
      index: './src/index.js'
    },

    output: {
      filename: `[name].inline_${ver2}.js`,
      publicPath: '',
      path: path.resolve(__dirname, '../dist')
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['env']
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          use: 'base64-inline-loader?name=[name].[ext]'
        },
        {
          test: /\.(png|jpe?g)$/,
          use: [
            {
              loader: 'tinify-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        INLINE: true,
        APP_NAME: JSON.stringify(pkg.name),
        APP_VERSION: JSON.stringify(pkg.version)
      }),
      new WebpackAutoInject({
        SILENT: true,
        components: {
            AutoIncreaseVersion: false
        }
      })
    ],

    resolve: {
      alias: {
        'TweenLite'   : path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
        'TimelineLite': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
        'TweenMax'    : path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
        'TimelineMax' : path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
        'PixiPlugin'  : path.resolve('node_modules', 'gsap/src/minified/plugins/PixiPlugin.min.js'),
        'Easing'      : path.resolve('node_modules', 'gsap/src/uncompressed/easing/EasePack.js')
      }
    }
  }
};
