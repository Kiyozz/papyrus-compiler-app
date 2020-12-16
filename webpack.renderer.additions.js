/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

const path = require('path')

module.exports = config => {
  const tsxRule = config.module.rules.find(
    r => r.test.toString() === '/\\.tsx?$/'
  )

  // Change to our rules
  const myConfig = {
    module: {
      rules: [
        tsxRule,
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: ['file-loader']
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [...config.plugins]
  }

  myConfig.plugins[
    config.mode === 'production' ? 0 : 1
  ].options.template = path.join(
    __dirname,
    'dist',
    '.renderer-index-template.html'
  )

  config.plugins = myConfig.plugins
  config.resolve = myConfig.resolve
  config.module = myConfig.module

  config.externals = []
  config.entry = config.entry.renderer[config.mode === 'production' ? 0 : 1]

  // Change output.filename in production (conflict with main)
  if (config.mode === 'production') {
    config.output = {
      ...config.output,
      filename: 'index.js'
    }
  }

  return config
}
