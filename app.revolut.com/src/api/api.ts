import { Flow, FileItem } from '../types'

export type Api = {
  loadFlow: (flowId: string, queryString?: string) => Promise<Flow | undefined>
  submitFlow: (flow: Flow) => Promise<any>
  uploadFile: (file: File, flowId: string) => Promise<FileItem>
}

const api: Api = {
  loadFlow: async (flowId: string, queryString = ''): Promise<Flow | undefined> => {
    const result = await fetch(`/api/forms/${flowId}${queryString}`)

    if (result.status === 404) {
      return undefined
    }

    if (!result.ok) {
      throw Error('Unable to load the form.')
    }

    return result.json()
  },

  submitFlow: async (flow: Flow) => {
    const result = await fetch(`/api/forms/${flow.id}/submit`, {
      method: 'POST',
      body: JSON.stringify(flow),
    })

    if (!result.ok) {
      throw Error('Unable to submit the form.')
    }

    return result.json()
  },

  uploadFile: async (file: File, flowId: string): Promise<FileItem> => {
    const formData = new FormData()
    formData.append('body', file)

    const result = await fetch(`/api/forms/${flowId}/uploads`, {
      method: 'POST',
      body: formData,
    })

    if (!result.ok) {
      throw Error('Unable to upload file.')
    }

    return result.json()
  },
}

export default api
