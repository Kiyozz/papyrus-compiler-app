module.exports = {
  branch: 'master',
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: ['papyrus-compiler-se.7z', 'papyrus-compiler-le.7z']
      }
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    '@semantic-release/git'
  ]
}
