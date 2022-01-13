import axios from 'axios'

export const removeExternalCard = async (cardId: string) =>
  axios.delete<void>(`/retail/card/${cardId}`)
