import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/notation-types.ts', 'src/path-animator.ts', 'src/path-generator.ts'],
  // {
  //   index: 'src/index.ts',
  //   // 'types/index': 'src/notation-types.ts',
  //   // 'path-animator/index': 'src/path-animator.ts',
  //   // 'path-generator/index': 'src/path-generator.ts',
  // },
  outDir: 'build',
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
})
