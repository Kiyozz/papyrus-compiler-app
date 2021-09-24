/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import webpack, { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const createConfig = (): Configuration => {
  const isProduction = process.env.NODE_ENV === 'production'

  const plugins = [
    // FIXME: investigate why MiniCssExtractPlugin is not recognize as WebpackPlugin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new MiniCssExtractPlugin() as any,
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'renderer', 'index.html'),
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'defer',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      ELECTRON_WEBPACK_APP_MOD_URL:
        'https://www.nexusmods.com/skyrimspecialedition/mods/23852',
      ELECTRON_TELEMETRY_FEATURE:
        process.env.ELECTRON_TELEMETRY_FEATURE ?? 'false',
    }),
  ].filter(Boolean)

  const rendererSources = path.resolve('src', 'renderer')
  const commonSources = path.resolve('src', 'common')
  const output = path.resolve('dist', 'renderer')

  const configuration: Configuration = {
    entry: {
      renderer: [
        path.join(rendererSources, 'index.tsx'),
        path.join(rendererSources, 'tailwind.css'),
        path.join(rendererSources, 'utilities.css'),
        path.join(rendererSources, 'app.css'),
      ],
    },
    output: {
      filename: 'index.js',
      path: output,
    },
    target: 'electron-renderer',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: rendererSources,
          use: [
            !isProduction ? 'css-hot-loader' : '',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ].filter(Boolean),
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
                      useBuiltIns: false,
                    },
                  ],
                ],
                plugins: [
                  !isProduction
                    ? ['react-refresh/babel', { skipEnvCheck: true }]
                    : '',
                  '@babel/plugin-proposal-optional-chaining',
                  '@babel/plugin-proposal-nullish-coalescing-operator',
                  '@babel/plugin-proposal-class-properties',
                ].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.(png|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024,
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024,
              },
            },
          ],
        },
      ],
    },
    plugins,
  }

  if (isProduction) {
    configuration.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        // FIXME: investigate why CssMinimizerWebpackPlugin is not recognize as WebpackPlugin
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new CssMinimizerWebpackPlugin() as any,
      ],
    }
  } else {
    if (Array.isArray(configuration.plugins)) {
      configuration.plugins.push(
        new ForkTsCheckerWebpackPlugin(),
        new ReactRefreshWebpackPlugin(),
      )
    }

    const entries = configuration.entry as Record<'renderer', string[]>

    entries.renderer.unshift('css-hot-loader/hotModuleReplacement')

    configuration.entry = entries
  }

  return configuration
}

export default createConfig()
