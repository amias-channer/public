import { useState, useMemo, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { v4 as uuid } from 'uuid'

import {
  createStructuredMessage,
  StaticForm,
  getStaticFormsAPI,
} from '../../helpers/forms'
import { StructuredMessageFiles } from '../../constants/structuredMessage'
import { initNewTicket } from '../../redux/reducers/tickets'
import { TabsEnum, TicketPaths } from '../../constants/routerPaths'
import {
  setItemToSessionStorage,
  getItemFromSessionStorage,
  removeItemFromSessionStorage,
  SessionStorage,
} from '../../constants/storage'

export const useForm = (staticFlowId: string, rawForm: StaticForm) => {
  const { formatMessage, locale } = useIntl()

  const [filesStore, setFilesStore] = useState<StructuredMessageFiles>({})
  const api = useMemo(
    () =>
      getStaticFormsAPI({
        id: staticFlowId,
        form: rawForm,
        locale,
        formatMessage,
        onFileUpload: (id, file) =>
          setFilesStore({ ...filesStore, [id]: file }),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawForm]
  )

  return {
    api,
  }
}

export const useTicketCreate = () => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const history = useHistory()
  return useCallback(
    (form, titleKey?: string) => {
      const correlationId = uuid()
      const structuredMessage = createStructuredMessage(form, () =>
        formatMessage({
          id: 'supportChat.dexter.description.title',
          defaultMessage: 'How can we help?',
        })
      )
      history.push(`${TabsEnum.CHAT}/${TicketPaths.NEW}`)
      dispatch(
        initNewTicket(
          correlationId,
          {
            message: structuredMessage,
            files: {},
          },
          {
            ...(titleKey ? { titleKey } : {}),
          },
          true
        )
      )
    },
    [history, dispatch, formatMessage]
  )
}

export const useDescriptionCache = () => ({
  setDesc: (description: string) =>
    setItemToSessionStorage(SessionStorage.ISSUE_DESCRIPTION, description),
  getDesc: () =>
    getItemFromSessionStorage(SessionStorage.ISSUE_DESCRIPTION) as string,
  clearDesc: () =>
    removeItemFromSessionStorage(SessionStorage.ISSUE_DESCRIPTION),
})
