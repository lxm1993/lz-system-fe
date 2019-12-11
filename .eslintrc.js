// .eslintrc.js
// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: { parser: 'babel-eslint' },
  env: { browser: true },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevent
    // ion consider switching to `plugin:vue/strongly-recommended` or
    // `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  globals: { NODE_ENV: false },
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 添加，分号必须
    semi: ['error', 'never'],
    'no-unexpected-multiline': 'off',
    'space-before-function-paren': ['error', 'never'],
    // 'quotes': ["error", "double", { "avoidEscape": true }]
    quotes: ['error', 'single', { avoidEscape: true }],
    'vue/no-use-v-if-with-v-for': ['error', { allowUsingIterationVar: true }],
    'prefer-promise-reject-errors': 0,
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        minProperties: 2,
      },
    ],
    'no-duplicate-imports': 1,
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'standard/no-callback-literal': 0,
  },
}
