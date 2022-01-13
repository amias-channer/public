import {
  API_MESSAGE_404,
  API_MESSAGE_403,
  API_MESSAGE_500,
  API_MESSAGE_400,
} from "../constants"
import { getIsTestnet, setIsTestnet } from "../store"
import API from "./api"
import Auth from "./auth"

const Transport = {
  /**
   * Get from an API Endpoint, sending auth token in headers
   * @param apiPath Path to URL endpoint under API
   * @param opts RequestInit opts, similar to Fetch API
   */
  async fetch(apiPath: string, opts: any = {}) {
    const session = await Auth.UNSAFE_getActiveSession()
    const authToken = session?.token
    const apiBase = API.getUrl()
    const apiKey = API.getKey()
    const url = apiBase + apiPath
    const isTestnet = getIsTestnet()
    let response = await fetch(url, {
      ...opts,
      headers: {
        ...(authToken ? { Authorization: `JWT ${authToken}` } : {}),
        ...(apiKey ? { "X-API-KEY": apiKey } : {}),
        ...(opts.headers || {}),
      },
    })
    response = await handleApiResponse(url)(response)
    const json = await response.json()
    setIsTestnet(isTestnet)
    return json
  },

  /**
   * Send JSON data to API, sending auth token in headers
   * @param apiPath Path to URL endpoint under API
   * @param opts RequestInit opts, similar to Fetch API, but
   * body can be an object and will get JSON-stringified. Like with
   * `fetch`, it can't be present when the method is "GET"
   */
  async sendJSON(apiPath: string, opts: any = {}) {
    const fetchOpts = {
      method: "POST",
      ...opts,
      body: JSON.stringify(opts.body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }

    return this.fetch(apiPath, fetchOpts)
  },

  async sendForm(apiPath: string, opts: any = {}) {
    const fetchOpts = {
      method: "POST",
      ...opts,
      body: opts.body,
    }

    return this.fetch(apiPath, fetchOpts)
  },
}

function handleApiResponse(url: string) {
  return async (response: Response) => {
    if (response.ok) {
      return response
    }

    let errorMessage: string
    let textResult = "unknown error"
    const baseUrl = API.getUrl()
    const path = url.split(baseUrl)[1]?.split("/")[1]

    try {
      textResult = await response.text()
      const json = JSON.parse(textResult)
      const jsonError = json.errors || json.error || json
      const getErrorString = (rawError: any): string =>
        typeof rawError === "object"
          ? Object.values(rawError).map(getErrorString).join(", ")
          : rawError.toString()
      errorMessage = getErrorString(jsonError)
    } catch (errorParsingError) {
      errorMessage = textResult
    }

    switch (response.status) {
      case 400:
        errorMessage = errorMessage || `${API_MESSAGE_400}: ${textResult}`
        break
      case 401:
      case 403:
        errorMessage = `${API_MESSAGE_403}${
          errorMessage ? ": " + errorMessage : ""
        }`
        break
      case 404:
        // Consolidate spammy 404s, remove the last path part
        console.warn(`Transport | url not found: ${url} (${errorMessage})`)
        errorMessage = `${API_MESSAGE_404}: path: /${path}`
        break
      case 500:
      case 503:
        console.warn(`Transport | error: ${url} (${errorMessage})`)
        errorMessage = `${API_MESSAGE_500}: path: /${path}`
        break
      default:
        errorMessage = `${response.status}: ${errorMessage}`
        break
    }

    throw new Error(errorMessage)
  }
}

export default Transport
