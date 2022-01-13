export const getGroupKey = (group: any[]) =>
  group.reduce((acc: string, item: any, index: number) => {
    acc += item.id || index
    return acc
  }, '')
