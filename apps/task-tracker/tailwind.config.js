const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      background: {
        50: 'var(--background-50)',
        100: 'var(--background-100)',
        200: 'var(--background-200)',
        300: 'var(--background-300)',
        400: 'var(--background-400)',
        500: 'var(--background-500)',
        600: 'var(--background-600)',
        700: 'var(--background-700)',
        800: 'var(--background-800)',
        900: 'var(--background-900)',
      },
      primary: {
        50: 'var(--primary-50)',
        100: 'var(--primary-100)',
        200: 'var(--primary-200)',
        300: 'var(--primary-300)',
        400: 'var(--primary-400)',
        500: 'var(--primary-500)',
        600: 'var(--primary-600)',
        700: 'var(--primary-700)',
        800: 'var(--primary-800)',
        900: 'var(--primary-900)',
        'text-light': 'var(--primary-text-light)',
        'text-dark': 'var(--primary-text-dark)',
      },
      accent: {
        50: 'var(--accent-50)',
        100: 'var(--accent-100)',
        200: 'var(--accent-200)',
        300: 'var(--accent-300)',
        400: 'var(--accent-400)',
        500: 'var(--accent-500)',
        600: 'var(--accent-600)',
        700: 'var(--accent-700)',
        800: 'var(--accent-800)',
        900: 'var(--accent-900)',
        'text-light': 'var(--accent-text-light)',
        'text-dark': 'var(--accent-text-dark)',
      },
      warn: {
        50: 'var(--warn-50)',
        100: 'var(--warn-100)',
        200: 'var(--warn-200)',
        300: 'var(--warn-300)',
        400: 'var(--warn-400)',
        500: 'var(--warn-500)',
        600: 'var(--warn-600)',
        700: 'var(--warn-700)',
        800: 'var(--warn-800)',
        900: 'var(--warn-900)',
        'text-light': 'var(--warn-text-light)',
        'text-dark': 'var(--warn-text-dark)',
      },
    },
  },
  plugins: [],
};
