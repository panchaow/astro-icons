/// <reference types="astro/astro-jsx" />

declare module 'virtual:icons/*' {
  const component: (props: astroHTML.JSX.SVGAttributes) => astroHTML.JSX.Element
  export default component
}
