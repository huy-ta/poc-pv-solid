import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import getEntryPathMap from './scripts/getEntryPathMap';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: getEntryPathMap({ dir: 'src/components', prefix: 's-' }),
  output: {
    dir: 'public/lib',
    format: 'cjs'
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      plugins: [['jsx-dom-expressions', { moduleName: 'solid-js/dom' }]]
    }),
    postcss({
      inject: false,
      use: [['sass', { includePaths: ['node_modules'] }]]
    }),
    !production && livereload('public'),
    production && terser()
  ]
};
