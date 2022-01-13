export const selectClassNames = (
  namespace: string,
  selection: {
    [name: string]: boolean | undefined
  },
  className?: string,
): string =>
  appendClassName(
    Object.keys(selection)
      .filter(name => selection[name])
      .map(name => `${namespace}--${name}`)
      .join(" "),
    className,
  )

export const appendClassName = (
  classNames: string,
  className?: string | boolean,
): string => {
  if (className === undefined) {
    return classNames
  }
  return `${classNames} ${className}`
}

/**
 * Change the HTML background class
 * Separates prefixes from class values using `separator`
 * Usage: changeBackgroundClass({ "test": "hi" }) => <html class="test-hi">
 * @param classes a mapping of class prefixes to values
 * @param separator a string to separate prefixes from values
 */
export function changeBackgroundClass(
  classes: { [prefix: string]: string },
  separator = "-",
) {
  const classNames = document
    .getElementsByTagName("html")[0]
    .className.split(/\s+/)
  Object.entries(classes).forEach(([k, v]) => {
    const newClassName = `${k}${separator}${v}`
    const index = classNames.findIndex(str => str.startsWith(k))
    if (index >= 0) {
      classNames[index] = newClassName
    } else {
      classNames.push(newClassName)
    }
  })
  document.getElementsByTagName("html")[0].className = classNames.join(" ")
}
