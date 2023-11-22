const randIdFn = 'const __randId = () => Math.random().toString(36).substr(2, 10);'
const idFn = 'const __id = (i) => idMap[i];'

export function replaceIDs(
  body: string,
  idReplacer?: (str: string, id: string) => string,
  referenceReplacer?: (str: string, attr: string, id: string) => string,
) {
  const hasID = /="url\(#/.test(body)
  const idMap: Record<string, string> = {}

  let injectScripts = ''

  if (hasID) {
    body = body
      .replace(/\b([\w-]+?)="url\(#(.+?)\)"/g, (f, s, id) => {
        idMap[id] = `'${id}':'icons-'+__randId()`

        return referenceReplacer ? referenceReplacer(f, s, id) : f
      })
      .replace(/\bid="(.+?)"/g, (full, id) => {
        if (idMap[id] && idReplacer)
          return idReplacer(full, id)
        return full
      })

    injectScripts = `${randIdFn}const idMap = {${Object.values(idMap).join(',')}};${idFn}`
  }

  return {
    svg: body,
    collectedIDs: Object.keys(idMap),
    injectScripts,
  }
}
