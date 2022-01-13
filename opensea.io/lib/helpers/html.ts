// https://stackoverflow.com/questions/822452/strip-html-from-text-javascript/47140708#47140708
export function stripHtml(html: string | undefined) {
  if (!html) {
    return ""
  }
  let ret = html.replace(/(<([^>]+)>)/gi, " ")
  if (typeof DOMParser != "undefined") {
    const doc = new DOMParser().parseFromString(ret, "text/html")
    ret = doc.body ? doc.body.textContent || "" : ret
  } else {
    // Fix Satoshi vulnerability with unfinished tags
    // "<a href="https://medium.com/@ethercraft" style="... color: rgb("
    ret = ret.replace(/<\s*[a-z][^>]+/gi, " ")
  }
  return ret
}
