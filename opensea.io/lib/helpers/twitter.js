export async function initTwitter() {
  window.twttr = (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {}
    if (d.getElementById(id)) return t
    js = d.createElement(s)
    js.id = id
    js.src = "https://platform.twitter.com/widgets.js"
    fjs.parentNode.insertBefore(js, fjs)

    t._e = []
    t.ready = function (f) {
      t._e.push(f)
    }

    return t
  })(document, "script", "twitter-wjs")

  return new Promise(resolve => {
    window.twttr.ready(twttr => {
      resolve(twttr)
    })
  })
}

export async function initTwitterWidgets() {
  if (!window.twttr) {
    await initTwitter()
  }

  return new Promise(resolve => {
    window.twttr.ready(() => {
      window.twttr.widgets.load()
      window.twttr.events.bind("loaded", event => resolve(event.widgets))
    })
  })
}
