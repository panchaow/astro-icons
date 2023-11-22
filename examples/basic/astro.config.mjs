import fs from 'node:fs/promises'
import { defineConfig } from 'astro/config'
import icons from 'astro-icons'
import { SVG, cleanupSVG, runSVGO } from '@iconify/tools'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [icons({
    customize(collection, icon, props) {
      props.width = '1.2em'
      props.height = '1.2em'
    },
    customCollections: {
      'my-icons': async (icon) => {
        const content = await fs.readFile(`./src/icons/my-icons/${icon}.svg`, 'utf-8')
        const svg = new SVG(content)

        cleanupSVG(svg)

        // Optimize
        runSVGO(svg)

        return svg.getIcon()
      },
    },
  }), react()],
})
