import { defineConfig } from 'astro/config'
import icons from 'astro-icons'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [icons({
    customize(collection, icon, props) {
      props.width = '1.2em'
      props.height = '1.2em'
    },
  }), react()],
})
