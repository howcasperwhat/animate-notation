import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'types/index': 'src/notation-types.ts',
    'path-animator/index': 'src/path-animator.ts',
    'path-generator/index': 'src/path-generator.ts',
  },
  outDir: 'build',
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
})
