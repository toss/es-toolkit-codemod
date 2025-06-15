import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: './dist',
  format: ['cjs'],
  external: ['jscodeshift'],
  clean: true,
}) 