/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

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
    '@semantic-release/changelog',
    '@semantic-release/git'
  ]
}
