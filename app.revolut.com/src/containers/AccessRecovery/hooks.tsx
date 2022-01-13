import { useState, useEffect, useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import { useIntl } from 'react-intl'

import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../../redux/reducers/auth'
import { initNewTicket } from '../../redux/reducers/tickets'
import { authSelector } from '../../redux/selectors/auth'
import {
  AccessRecoveryForm,
  useAccessRecoveryFormFieldTitle,
  ACCESS_RECOVERY_TITLE_KEY,
} from '../../constants/accessRecovery'

import {
  FormView,
  StaticForm,
  getValuesFromStaticForm,
  createStructuredMessage,
  getStaticFormsAPI,
} from '../../helpers/forms'
import { useSendChatEvent, useSetAccessRecoveryMode } from '../../providers'
import { StructuredMessageFiles } from '../../constants/structuredMessage'

export const useForm = (staticFlowId: string, rawForm: StaticForm) => {
  const { formatMessage, locale } = useIntl()
  const sendChatEvent = useSendChatEvent()

  const setAccessRecoveryMode = useSetAccessRecoveryMode()
  const { getAccessRecoveryFormFieldTitle } = useAccessRecoveryFormFieldTitle()
  const { clientId } = useSelector(authSelector)

  const [
    accessRecoveryForm,
    setAccessRecoveryForm,
  ] = useState<AccessRecoveryForm | null>(null)
  const [filesStore, setFilesStore] = useState<StructuredMessageFiles>({})
  const dispatch = useDispatch()
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  useEffect(() => {
    if (!clientId || !accessRecoveryForm || isFormSubmitted) {
      return
    }
    const correlationId = uuid()
    const structuredMessage = createStructuredMessage(
      accessRecoveryForm,
      getAccessRecoveryFormFieldTitle
    )
    dispatch(
      initNewTicket(
        correlationId,
        {
          message: structuredMessage,
          files: filesStore,
        },
        {
          titleKey: ACCESS_RECOVERY_TITLE_KEY,
        },
        true
      )
    )
    setAccessRecoveryMode(false)
    setIsFormSubmitted(true)
  }, [
    clientId,
    accessRecoveryForm,
    isFormSubmitted,
    filesStore,
    dispatch,
    getAccessRecoveryFormFieldTitle,
    setAccessRecoveryMode,
  ])

  const onFlowComplete = ({ response }: { response: FormView[] }) => {
    const values = (getValuesFromStaticForm(
      response
    ) as unknown) as AccessRecoveryForm
    const { companyName, name, phoneNumber } = values

    if (!clientId) {
      dispatch(
        signIn({
          businessName: companyName.value?.value,
          name: name.value?.value,
          phone: `+${phoneNumber.value.code}${phoneNumber.value?.number}`,
          anonymous: true,
        })
      )
    }
    setAccessRecoveryForm(values)
  }

  const api = useMemo(
    () =>
      getStaticFormsAPI({
        id: staticFlowId,
        form: rawForm,
        locale,
        sendChatEvent,
        formatMessage,
        onFileUpload: (id, file) =>
          setFilesStore({ ...filesStore, [id]: file }),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return {
    onFlowComplete,
    isLoading: !!accessRecoveryForm,
    api,
  }
}
