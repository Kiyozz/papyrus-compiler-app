/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import SpeedMeasureWebpackPlugin from 'speed-measure-webpack-plugin'

/**
 * @return {import('webpack').Configuration}
 */
export default () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const mode = isProduction ? 'production' : 'development'

  const plugins = [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'renderer', 'index.html'),
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'defer'
    }),
    !isProduction && new SpeedMeasureWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      ELECTRON_WEBPACK_APP_MOD_URL:
        'https://www.nexusmods.com/skyrimspecialedition/mods/23852'
    })
  ].filter(Boolean)

  const rendererSources = path.resolve('src', 'renderer')
  const output = path.resolve('dist', 'renderer')

  /** @type {import('webpack').Configuration} */
  const myNewConfig = {
    devtool: isProduction ? 'nosources-source-map' : 'eval-source-map',
    mode,
    entry: {
      renderer: [path.join(rendererSources, 'test.tsx')]
    },
    output: {
      filename: 'index.js',
      path: output
    },
    target: 'electron-renderer',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: rendererSources,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.tsx?$/,
          include: rendererSources,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        chrome: 86
                      },
                      useBuiltIns: false
                    }
                  ]
                ],
                plugins: [
                  mode !== 'production' && [
                    'react-refresh/babel',
                    { skipEnvCheck: true }
                  ]
                ].filter(Boolean)
              }
            }
          ]
        },
        {
          test: /\.png$/,
          include: rendererSources,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                name: 'imgs/[name]--[folder].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          include: rendererSources,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                name: 'fonts/[name]--[folder].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins
  }

  if (isProduction) {
    myNewConfig.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()]
    }
  } else {
    myNewConfig.plugins.push(
      new ForkTsCheckerWebpackPlugin(),
      new ReactRefreshWebpackPlugin()
    )

    myNewConfig.devServer = {
      host: 'localhost',
      port: '9080',
      hot: true,
      overlay: true
    }

    myNewConfig.entry.renderer.unshift('css-hot-loader/hotModuleReplacement')
  }

  return myNewConfig
}
