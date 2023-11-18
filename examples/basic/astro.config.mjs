import { defineConfig } from 'astro/config'

import icons from 'astro-icons'

// https://astro.build/config
export default defineConfig({
  integrations: [
    icons(),
  ],
})
