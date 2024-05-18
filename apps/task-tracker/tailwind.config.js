const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const themePlugin = require('../../libs/core/web/src/lib/theme/tailwind-theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.spec).{ts,html}'),
    join(__dirname, '../../libs/**/web/**/!(*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [themePlugin],
};
