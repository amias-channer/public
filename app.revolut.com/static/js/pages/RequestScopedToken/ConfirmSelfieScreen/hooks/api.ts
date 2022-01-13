import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { useMutation } from 'react-query'

import {
  BiometricSignInConfirmResponseDto,
  BiometricSignInSubmitSelfieResponseDto,
  GeneralErrorDto,
} from '@revolut/rwa-core-types'
import { useAuthorizeUser } from '@revolut/rwa-core-auth'
import { HttpCode } from '@revolut/rwa-core-utils'

import {
  confirmSelfieSubmission as confirmSelfieSubmissionAPI,
  submitSelfie as submitSelfieAPI,
} from 'api'
import { useAuthorizeUserWithSelfieOption } from 'hooks'

type UseHandleSelfieSubmitArgs = {
  selfieBlob: Blob
  onSuccess: () => void
  onError: (e?: AxiosError<GeneralErrorDto>) => void
}

type CheckSelfieStateAndAuthorizeUserArgs = {
  id: string
} & Pick<UseHandleSelfieSubmitArgs, 'onSuccess' | 'onError'>

const REPEAT_SELFIE_CHECK_TIMEOUT = 1_000

export const useConfirmSelfieSubmission = () => {
  const authorizeUser = useAuthorizeUser()

  const { mutate } = useMutation<
    AxiosResponse<BiometricSignInConfirmResponseDto>,
    AxiosError<GeneralErrorDto>,
    string
  >(confirmSelfieSubmissionAPI)

  const checkSelfieStateAndAuthorizeUser = useCallback(
    async ({ id, onSuccess, onError }: CheckSelfieStateAndAuthorizeUserArgs) => {
      await mutate(id, {
        onSuccess: ({ data, status }) => {
          // 204 status code means that selfie check is in progress and we are repeating
          // requests until receive 200
          if (status === HttpCode.NoContent) {
            setTimeout(() => {
              checkSelfieStateAndAuthorizeUser({ id, onSuccess, onError })
            }, REPEAT_SELFIE_CHECK_TIMEOUT)

            return
          }

          authorizeUser(
            {
              user: data.user,
              accessToken: data.accessToken,
              tokenExpiryDate: data.tokenExpiryDate,
            },
            {
              tokenIsRestricted: false,
            },
          ).then(onSuccess)
        },
        onError,
      })
    },
    [authorizeUser, mutate],
  )

  return checkSelfieStateAndAuthorizeUser
}

const useSubmitSelfie = () => {
  const { mutate } = useMutation<
    AxiosResponse<BiometricSignInSubmitSelfieResponseDto>,
    AxiosError<GeneralErrorDto>,
    Blob
  >(submitSelfieAPI)

  return mutate
}

export const useUploadSelfie = () => {
  const [isUploading, setIsUploading] = useState(false)

  const authorizeUserWithSelfieOption = useAuthorizeUserWithSelfieOption()
  const submitSelfie = useSubmitSelfie()
  const confirmSelfieSubmission = useConfirmSelfieSubmission()

  const uploadSelfie = useCallback(
    async ({ selfieBlob, onSuccess, onError }: UseHandleSelfieSubmitArgs) => {
      setIsUploading(true)

      const handleSubmitSelfieSuccess = (
        data: BiometricSignInSubmitSelfieResponseDto,
      ) => {
        const handleSuccessSelfieSubmission = () => {
          setIsUploading(false)

          onSuccess()
        }

        if (data) {
          confirmSelfieSubmission({
            id: data.id,
            onSuccess: handleSuccessSelfieSubmission,
            onError,
          })
        }
      }

      const handleSelfieUsageSuccess = () => {
        submitSelfie(selfieBlob, {
          onSuccess: ({ data }) => handleSubmitSelfieSuccess(data),
          onError,
        })
      }

      authorizeUserWithSelfieOption({
        isSelfieUsed: true,

        onSuccess: handleSelfieUsageSuccess,
        onError,
      })
    },
    [confirmSelfieSubmission, authorizeUserWithSelfieOption, submitSelfie],
  )

  return { uploadSelfie, isUploading }
}
