module.exports = {
  extends: '@ctm/rewards/node',
  env: {
    node: true,
    jest: true,
  },
  globals: {
    sinon: true,
},
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-unused-expressions': 0,
        'no-global-assign': 0
      }
    }
  ]
};