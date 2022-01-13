import React from "react"
import NoticeActions from "../actions/notices"
import { Notice as NoticeType } from "../reducers/notices"
import { dispatch } from "../store"
import StoreComponent from "./StoreComponent.react"

export default class Notice extends StoreComponent {
  prevNotice: NoticeType = null

  componentDidUpdate() {
    if (this.store.notice !== this.prevNotice) {
      scrollTo({ top: 0 })
      this.prevNotice = this.store.notice
    }
  }

  render() {
    const { notice } = this.store
    return (
      <div className="Notice row">
        {!notice ? null : (
          <div className="col s12 m10 offset-m1">
            <div className="card orange no-margin relative layer1">
              <button
                className="btn-flat right white-text"
                style={{ marginTop: 12 }}
                onClick={() => dispatch(NoticeActions.reset())}
              >
                <i className="material-icons right">close</i>
              </button>
              <div className="card-content">
                <p className="center white-text">{notice}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
