import { AmplitudeClient, Config } from "amplitude-js"
import { IS_SERVER, IS_TEST } from "../../../constants"
import { getIsTestnet } from "../../../store"
import { trackEventWithClient } from "../analytics"
import { PLUGIN_KEYS } from "./constants"
import { AnalyticsPlugin } from "./types"

const amplitudeId = "ddd6ece4d5ddebbf244a249703c9d662"
const amplitudeIdRinkeby = "d2882307b723c69ff5e75f8333c6cb10"

const getAmplitude = async () => {
  const amplitude = await import("amplitude-js")
  return amplitude.getInstance()
}

const amplitudePlugin: AnalyticsPlugin<Config> = config => {
  let client: AmplitudeClient

  return {
    name: PLUGIN_KEYS.AMPLITUDE,
    config,
    initialize: async ({ config }) => {
      if (IS_SERVER || IS_TEST) {
        return
      }
      const amplitude = await getAmplitude()
      amplitude.init(
        getIsTestnet() ? amplitudeIdRinkeby : amplitudeId,
        undefined,
        config,
        initializedClient => {
          client = initializedClient
        },
      )
    },
    page: ({ payload: { properties, options } }) => {
      let event = "Page View"
      if (options && options.event) {
        event = options.event
      }
      trackEventWithClient(client, event, properties)
    },
    track: ({ payload: { event, properties } }) => {
      trackEventWithClient(client, event, properties)
    },
    identify: ({ payload: { userId, traits } }) => {
      client.setUserId(userId)
      client.setUserProperties(traits)
    },
    loaded: () => {
      return !!client
    },
  }
}

export default amplitudePlugin
