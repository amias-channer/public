import React, { useCallback, useMemo } from "react"
import qs from "qs"
import { v4 as uuid } from "uuid"
import {
  ChainIdentifier,
  MOONPAY_LOGO_IMG,
  MOONPAY_WIDGET_URL,
} from "../../../constants"
import Block from "../../../design-system/Block"
import Flex from "../../../design-system/Flex"
import Modal from "../../../design-system/Modal"
import { useMultiStepFlowContext } from "../../../design-system/Modal/MultiStepFlow.react"
import Text from "../../../design-system/Text"
import useAppContext from "../../../hooks/useAppContext"
import { useMountEffect } from "../../../hooks/useMountEffect"
import { useTranslations } from "../../../hooks/useTranslations"
import {
  trackMoonPayTxFail,
  trackMoonPayTxSuccess,
  trackOpenMoonPayModal,
  trackStartMoonPayTx,
} from "../../../lib/analytics/events/checkoutEvents"
import { CheckoutModalQueryVariables } from "../../../lib/graphql/__generated__/CheckoutModalQuery.graphql"
import { UnreachableCaseError } from "../../../lib/helpers/type"
import CenterAligned from "../../common/CenterAligned.react"
import IFrame from "../../common/IFrame.react"
import CheckoutModal from "../CheckoutModal.react"
import { TxStatus } from "./types"
import { useMoonPayTxStatus } from "./useMoonPayTxStatus"
import { getCurrencyCode, padFiatValueWithFeeAmt } from "./utils"

export type MoonPayModalProps = {
  symbol?: string
  chain?: ChainIdentifier
  fiatCurrency?: string
  fiatValue?: number
  userEmailAddress?: string
  onClose?: () => unknown
  onDone?: () => unknown
  checkoutVariables?: CheckoutModalQueryVariables
}

export const MoonPayModal = ({
  symbol,
  chain,
  fiatCurrency,
  fiatValue,
  onClose,
  onDone,
  checkoutVariables,
}: MoonPayModalProps) => {
  const { tr } = useTranslations()
  const { wallet } = useAppContext()
  const { onPrevious, onNext } = useMultiStepFlowContext()
  const externalTransactionId = useMemo(() => uuid(), [])

  // https://www.moonpay.com/dashboard/getting_started/ - Step 2: Customize the widget
  const queryParamsObj = {
    currencyCode: getCurrencyCode(symbol, chain),
    baseCurrencyCode: fiatCurrency,
    baseCurrencyAmount: fiatValue
      ? padFiatValueWithFeeAmt(fiatValue)
      : undefined,
    email: wallet.activeAccount?.user?.email,
    externalTransactionId,
  }
  const widgetUrl = `${MOONPAY_WIDGET_URL}&${qs.stringify(queryParamsObj)}`

  const analyticsParams = useMemo(
    () => ({
      symbol,
      chain,
      fiatCurrency,
      fiatValue,
      externalTransactionId,
      widgetUrl,
    }),
    [chain, externalTransactionId, fiatCurrency, fiatValue, symbol, widgetUrl],
  )

  useMountEffect(() => {
    trackOpenMoonPayModal(analyticsParams)
  })

  const onTxCompleted = useCallback(() => {
    if (checkoutVariables && onClose) {
      onNext(<CheckoutModal variables={checkoutVariables} onClose={onClose} />)
    } else {
      onDone?.()
    }
  }, [checkoutVariables, onClose, onDone, onNext])

  const onTxStatusChange = useCallback(
    (txStatus: TxStatus) => {
      switch (txStatus) {
        case "not started":
          return
        case "pending":
          return trackStartMoonPayTx(analyticsParams)
        case "successful":
          return trackMoonPayTxSuccess(analyticsParams)
        case "failed":
          return trackMoonPayTxFail(analyticsParams)
        default:
          throw new UnreachableCaseError(txStatus)
      }
    },
    [analyticsParams],
  )

  const { status } = useMoonPayTxStatus({
    externalTransactionId,
    onTxCompleted,
    onTxStatusChange,
    symbol,
    chain,
  })

  return (
    <>
      <Modal.Header onPrevious={onPrevious}>
        <Modal.Title>{tr("Continue checkout")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {(status === "pending" ||
          status === "waitingAuthorization" ||
          status === "completed") && (
          <CenterAligned textAlign="center">
            <Text marginTop={0}>
              {tr(
                "Sit tight. It may take a few minutes for the funds to reach your wallet.",
              )}
            </Text>
          </CenterAligned>
        )}
        <Block height="600px">
          <IFrame
            allow="accelerometer; autoplay; camera; gyroscope; payment"
            className="MoonpayModal--iframe"
            url={widgetUrl}
          />
        </Block>
        <CenterAligned marginTop="24px">
          <Flex alignItems="center">
            <Text display="inline" variant="info-bold">
              {tr("Powered by ")}
            </Text>
            <Block marginLeft="8px">
              <img alt="MoonPay logo" src={MOONPAY_LOGO_IMG} />
            </Block>
          </Flex>
        </CenterAligned>
      </Modal.Body>
    </>
  )
}

export default MoonPayModal
