export const sanitazeQuery = (query: string) => {
  return query.replace(/[^a-zA-Z0-9]/g, "")
}
