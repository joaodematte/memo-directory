/** @type {import("prettier").Config} */
const config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'none',
  bracketSameLine: false,
  semi: true,
  quoteProps: 'consistent',
  importOrder: [
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/',
    '',
    '^[../]',
    '^[./]'
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators'],
  importOrderCaseSensitive: true,
  importOrderTypeScriptVersion: '5.8.3',
  tailwindFunctions: ['clsx', 'cn', 'cva']
};

export default config;
