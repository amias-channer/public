import { useEffect } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { Url } from '@revolut/rwa-core-utils'

import { useForm } from 'hooks'

export const FormLinkOpener = ({ match }: RouteComponentProps<{ formId: string }>) => {
  const formId = match.params?.formId
  const { openForm } = useForm()
  const { isAuthorized } = useAuthContext()

  useEffect(() => {
    if (formId && isAuthorized) {
      openForm(formId)
    }
  }, [openForm, formId, isAuthorized])

  return isAuthorized ? <Redirect to={Url.CardsOverview} /> : null
}
