import { API_MESSAGE_404 } from "../constants"
import Transport from "../lib/transport"
import ErrorActions from "./errors"
import FetchingActions from "./fetching"
import * as ActionTypes from "./index"

const BundleActions = {
  /**
   * Resets the bundle and calls out to fetcher for a new one
   * @param {string} bundleSlug
   * @param {object} req optional SSR Node.js request
   * @param {object} res optional Node.js response
   */
  find(bundleSlug, req = null, res = null) {
    return async function (dispatch, getState) {
      dispatch(BundleActions.reset())
      dispatch(FetchingActions.start("Loading bundle data"))
      try {
        return await dispatch(BundleActions._load(bundleSlug, { request: req }))
      } catch (error) {
        if (error.message.startsWith(API_MESSAGE_404)) {
          dispatch(ErrorActions.handleNotFound(res))
        } else {
          dispatch(
            ErrorActions.show(
              error,
              `There was an error trying to load this bundle. Try refreshing the page.`,
            ),
          )
        }
        return getState().bundle
      } finally {
        // TODO queue loading events
        // Otherwise, this causes loader to flash when loading events
        // disp
        dispatch(FetchingActions.stop())
      }
    }
  },

  _load(bundleSlug, { request = null } = {}) {
    return async function (dispatch, getState) {
      const bundleRequest = `/bundle/${bundleSlug}/`
      const data = await Transport.fetch(bundleRequest, { request })
      dispatch(BundleActions.receive(data))
      return getState().bundle
    }
  },

  startCreating() {
    return this.bootstrap({ creating: true })
  },

  bootstrap(bundle) {
    return { type: ActionTypes.BOOTSTRAP_BUNDLE, bundle }
  },

  reset() {
    return { type: ActionTypes.RESET_BUNDLE }
  },

  receive(data) {
    return { type: ActionTypes.RECEIVE_BUNDLE, data }
  },

  refresh(bundle, opts = {}) {
    return async function (dispatch) {
      if (bundle.slug) {
        try {
          await dispatch(BundleActions._load(bundle.slug, opts))
        } catch (error) {
          dispatch(
            ErrorActions.show(
              error,
              `There was an error trying to refresh this bundle. Try refreshing the page.`,
            ),
          )
        }
      }
    }
  },

  updatePrice() {
    return { type: ActionTypes.UPDATE_PRICE }
  },
}

export default BundleActions
