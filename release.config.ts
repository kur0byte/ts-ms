const config = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ["@semantic-release/git", {
      "assets": ["dist/*.ts", "dist/*.ts.map"],
      "message": "chore(release): <version> [skip ci]\n\n<release notes>"
    }],
    '@semantic-release/github'
  ]
};

export default config;
