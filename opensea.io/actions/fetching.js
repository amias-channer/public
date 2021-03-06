import * as ActionTypes from "./index"

const FetchingActions = {
  start(message) {
    return { type: ActionTypes.START_FETCHING, message }
  },

  stop() {
    return { type: ActionTypes.STOP_FETCHING }
  },
}

export default FetchingActions
