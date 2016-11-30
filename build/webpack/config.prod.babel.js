import path from 'path'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'

import webpackConfigBase from './config.base.babel'
import {projectRootPath, projectSourcePath, projectDistPath, templatePath} from '../config'
import data from '../config/data'

export default webpackMerge(webpackConfigBase, {
  devtool: 'source-map',
  entry: {
    app: path.join(projectSourcePath, 'app/main.js')
  },
  output: {
    publicPath: '/',
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader')
      }, {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
      }
    ]
  },
  plugins: [
    // define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // OccurrenceOrderPlugin is needed for long-term caching to work properly
    // see http://mxs.is/googmv
    new webpack.optimize.OccurrenceOrderPlugin(),
    // merge all duplicate modules
    new webpack.optimize.DedupePlugin(),
    // minify and optimize the javaScript
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false
      }
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(projectRootPath, 'node_modules')) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // extract the CSS into a separate file
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
    // minify and optimize the index.html
    new HtmlWebpackPlugin({
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      inject: true,
      template: templatePath,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      data
    }),
    // inline webpack manifest
    // https://www.npmjs.com/package/inline-manifest-webpack-plugin
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    // generate a webpack-assets.json file that contains all assets' paths
    // https://github.com/kossnocorp/assets-webpack-plugin
    new AssetsPlugin({
      path: path.join(projectRootPath, 'dist')
    }),
    new SWPrecacheWebpackPlugin({
      cacheId: 'm&j',
      filepath: `${projectDistPath}/service-worker.js`,

      // ensure all our static, local assets will be cached in background
      staticFileGlobs: [
        `${projectDistPath}/**/!(*map*|*yml*)`,
      ],
      // stripPrefix: projectDistPath,

      runtimeCaching: [
        {
          handler: 'networkFirst',
          urlPattern: /\.(svg|eot|ttf|woff|woff2|jpg|webp|png)$/
        }
      ],

      verbose: true
    })
  ]
})
