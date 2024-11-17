// import { FlatESLintConfig } from 'eslint-define-config'
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: '@typescript-eslint/parser', // Parser for <script> blocks
      },
    },
    plugins: {
      vue: vue,
      '@typescript-eslint': ts,
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
]
