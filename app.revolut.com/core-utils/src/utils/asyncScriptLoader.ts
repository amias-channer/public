export const asyncScriptLoader = (url: string) =>
  new Promise((resolve, reject) => {
    const scriptTag = document.getElementsByTagName('script')[0]
    const tag = document.createElement('script')

    tag.src = url
    tag.async = true
    tag.onload = resolve
    tag.onerror = reject

    scriptTag.parentNode && scriptTag.parentNode.insertBefore(tag, scriptTag)
  })
