const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')

const appVersion = process.env.APP_VERSION || ''
const { parsed } = dotenv.config({ path: path.resolve(__dirname, `.env.${appVersion ? appVersion.toLowerCase() : 'development'}`) })

module.exports = config => {
  // Remove Banner Plugin installing source-map-support
  // config.plugins.pop()
  config.plugins.push(new webpack.EnvironmentPlugin(Object.keys(parsed)))

  return config
}
