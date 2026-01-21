import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { dts } from 'rollup-plugin-dts';
import { readFileSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync('./lib-package.json', 'utf-8'));

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.lib.json',
        outDir: 'dist',
        declaration: true,
        declarationDir: 'dist',
        exclude: ['**/*.test.*', '**/*.stories.*', 'src/pages/**', 'src/App.tsx', 'src/main.tsx']
      }),
      {
        name: 'copy-css',
        generateBundle() {
          copyFileSync('src/spreadsheet.css', 'dist/spreadsheet.css');
        }
      }
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];