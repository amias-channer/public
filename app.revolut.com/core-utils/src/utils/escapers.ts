export const removeLinks = (string: string) => string.replace(/<[/]?(a)[^><]*>/g, '')

export const replaceHtmlEntities = (string?: string) => {
  if (string) {
    return `${string}`.replace(/&#\d+;/gm, (s: any) => {
      return String.fromCharCode(s.match(/\d+/gm)[0])
    })
  }

  return ''
}
