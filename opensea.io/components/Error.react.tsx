import React from "react"
import ErrorActions from "../actions/errors"
import { Error as ErrorType } from "../reducers/errors"
import { dispatch } from "../store"
import StoreComponent from "./StoreComponent.react"

export default class Error extends StoreComponent {
  prevError: ErrorType = null

  componentDidUpdate() {
    if (this.store.error !== this.prevError) {
      scrollTo({ top: 0 })
      this.prevError = this.store.error
    }
  }

  render() {
    const { error } = this.store
    const hideError = !error // || error.includes("json response body")
    return (
      <div className="Error Notice row" data-testid="Error">
        {hideError ? null : (
          <div className="col s12 m10 offset-m1" data-testid="Error--text">
            <div className="card red lighten-1 no-margin relative layer1">
              <button
                className="btn-flat right white-text"
                style={{ marginTop: 12 }}
                onClick={() => dispatch(ErrorActions.reset())}
              >
                <i className="material-icons right">close</i>
              </button>
              <div className="card-content">
                <p className="center white-text">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
