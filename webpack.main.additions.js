const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')

const appVersion = process.env.APP_VERSION || ''
const { parsed } = dotenv.config({ path: path.resolve(__dirname, `.env.${appVersion ? appVersion.toLowerCase() : 'development'}`) })

module.exports = config => {
  config.resolve.plugins = [new TsconfigPathsWebpackPlugin()]

  config.module.rules.push({
    test: /\.html$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].html'
        }
      }
    ]
  })

  // Remove Banner Plugin installing source-map-support
  // config.plugins.pop()
  config.plugins.push(new webpack.EnvironmentPlugin(Object.keys(parsed)))

  return config
}
