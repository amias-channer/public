import { createAction } from 'redux-act'

export const FeedbackActions = {
  PUT: 'FEEDBACK/PUT',
}

export const putFeedbackOptions = createAction(FeedbackActions.PUT)
