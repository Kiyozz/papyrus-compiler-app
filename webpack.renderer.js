/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

/**
 * @return {Partial<webpack.Configuration>}
 */
const createConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  const plugins = [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'renderer', 'index.html'),
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'defer'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      ELECTRON_WEBPACK_APP_MOD_URL:
        'https://www.nexusmods.com/skyrimspecialedition/mods/23852',
      ELECTRON_TELEMETRY_FEATURE:
        process.env.ELECTRON_TELEMETRY_FEATURE ?? 'false'
    })
  ].filter(Boolean)

  const rendererSources = path.resolve('src', 'renderer')
  const commonSources = path.resolve('src', 'common')
  const output = path.resolve('dist', 'renderer')

  /** @var {webpack.Configuration} */
  const configuration = {
    entry: {
      renderer: [
        path.join(rendererSources, 'index.tsx'),
        path.join(rendererSources, 'tailwind.css'),
        path.join(rendererSources, 'utilities.css'),
        path.join(rendererSources, 'app.css')
      ]
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
            !isProduction && 'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ].filter(Boolean)
        },
        {
          test: /\.tsx?$/,
          include: [rendererSources, commonSources],
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
                      useBuiltIns: false
                    }
                  ]
                ],
                plugins: [
                  !isProduction && [
                    'react-refresh/babel',
                    { skipEnvCheck: true }
                  ],
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  '@babel/plugin-proposal-class-properties'
                ].filter(Boolean)
              }
            }
          ]
        },
        {
          test: /\.(png|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024
              }
            }
          ]
        }
      ]
    },
    plugins
  }

  if (isProduction) {
    configuration.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin(), new CssMinimizerWebpackPlugin()]
    }
  } else {
    configuration.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new ReactRefreshWebpackPlugin()
    )

    configuration.devServer = {
      host: 'localhost',
      port: '9080',
      hot: true,
      overlay: true
    }

    configuration.entry.renderer.unshift('css-hot-loader/hotModuleReplacement')
  }

  return configuration
}

module.exports = createConfig()
