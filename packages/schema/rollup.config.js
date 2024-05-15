import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import rollupReplace from 'rollup-plugin-replace';
const packageJson = require('./package.json');

const createTsPlugin = ({ declaration = true, target } = {}) =>
  typescript({
    clean: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration,
        ...(target && { target })
      }
    }
  });

const createNpmConfig = ({ input, output, external }) => ({
  input,
  output,
  preserveModules: true,
  plugins: [createTsPlugin({ declaration: false })],
  external
});

const createUmdConfig = ({ input, output, target = undefined }) => ({
  input,
  output,
  plugins: [
    rollupReplace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    createTsPlugin({ declaration: false, target }),
    terser({
      toplevel: true,
      format: {
        comments: false
      }
    })
  ]
});

export default [
  createNpmConfig({
    input: 'src/index.ts',
    output: [
      {
        dir: 'es',
        format: 'esm'
      }
    ],
    external: Object.keys(packageJson.dependencies)
  }),
  createUmdConfig({
    input: 'src/index.ts',
    output: {
      file: 'umd/schema.js',
      format: 'umd',
      name: 'ApimaticSchema'
    }
  }),
  createUmdConfig({
    input: 'src/index.ts',
    output: {
      file: 'umd/schema.esm.js',
      format: 'esm'
    },
    target: 'ES2015'
  })
];
