const WebpackAutoInject = require('webpack-auto-inject-version');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack           = require('webpack');
const path              = require('path');
const pkg               = require('./package.json');
const ver2              = `${pkg.version.split('.')[0]}.${pkg.version.split('.')[1]}`;
const TINYPNG_KEY       = '6amPuF6Alzl0qh4KQ7gJTxnYW0XEEP5e';


module.exports = (env, argv) => {

  const dev = argv.mode == 'development';

  return {
    entry: {
      index: './src/index.js'
    },

    output: {
      filename: `[name].bundle_${ver2}.js`,
      chunkFilename: `[name].bundle_${ver2}.js`,
      publicPath: '',
      path: path.resolve(__dirname, 'dist')
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
        { // Image and font files that are 'required' should be copied to the images folder.
          test: /\.(png|jpe?g|gif|ico|svg|woff)$/,
          use: [{
            loader: 'file-loader',
            options: {
              context: './src',
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }]
        },
        {
          test: /\.(png|jpe?g)$/,
          use: [
            {
              loader: 'tinify-loader',
              options: {
                apikey: TINYPNG_KEY
              }
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
        APP_NAME: JSON.stringify(pkg.name),
        APP_LAUNCHER: JSON.stringify(`index.bundle_${ver2}.js`),
        APP_VERSION: JSON.stringify(pkg.version),
        PUBLIC_PATH: dev ? '""' : JSON.stringify(pkg.settings.publicPath),
        TARGET_URL: JSON.stringify(pkg.settings.targetUrl)
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.ejs",
        filename: "./index.html",
        inject: false,
        title: pkg.title
      }),
      new HtmlWebPackPlugin({
        template: "./src/tag.ejs",
        filename: "./tag.txt",
        inject: false,
        title: pkg.title
      }),
      new CopyWebpackPlugin([
        { from: './src/config.json'},
        { from: './readme.md'}
      ]),
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
