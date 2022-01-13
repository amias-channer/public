import { AsyncAction } from "../store"
import * as ActionTypes from "./index"

const NoticeActions = {
  show:
    (notice: string | null = null): AsyncAction<void> =>
    async dispatch => {
      console.warn(notice)
      dispatch({ type: ActionTypes.SHOW_NOTICE, notice })
    },

  reset: (): AsyncAction<void> => async dispatch => {
    dispatch({ type: ActionTypes.RESET_NOTICE })
  },
}

export default NoticeActions
