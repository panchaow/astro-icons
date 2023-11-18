import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index.ts',
    './src/types.ts',
  ],
  failOnWarn: false,
  declaration: true,
})
