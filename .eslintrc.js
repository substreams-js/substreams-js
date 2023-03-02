module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./packages/*/tsconfig.json', './packages/*/tsconfig.node.json', './examples/*/tsconfig.json', './examples/*/tsconfig.node.json'],
  },
  plugins: ['@typescript-eslint'],
  root: true,
};
