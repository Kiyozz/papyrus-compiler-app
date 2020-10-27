module.exports = {
  branch: 'master',
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          commitUrlFormat: ' ',
          compareUrlFormat: ' ',
          userUrlFormat: ' '
        }
      }
    ],
    '@semantic-release/changelog',
    '@semantic-release/git'
  ]
}
