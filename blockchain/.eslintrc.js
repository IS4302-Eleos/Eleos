module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true,
    'truffle/globals': true
  },
  extends: [
    'standard'
  ],
  plugins: [
    'truffle'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
