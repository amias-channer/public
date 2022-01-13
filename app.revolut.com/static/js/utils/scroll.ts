const DELTA_DIFFERENCE = 0.98

export const isScrollAtBottom = () => {
  return (
    document.body.scrollHeight * DELTA_DIFFERENCE <= window.scrollY + window.innerHeight
  )
}
