module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // "plugin:vue/essential",
    // "eslint:recommended",
    // "@vue/prettier"
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'func-names': 'off',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 1,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/require-default-prop': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
