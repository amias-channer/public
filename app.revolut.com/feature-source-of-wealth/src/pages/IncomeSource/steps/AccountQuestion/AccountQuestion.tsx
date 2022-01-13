import { FC, useContext, ChangeEvent } from 'react'
import { Button, Layout } from '@revolut/ui-kit'

import { useTranslation } from '../../../../hooks'
import { EntityBlock, Header, Main, RadioSelect } from '../../../../components'
import { I18nNamespace, getEmptyType } from '../../../../utils'
import {
  SOWDocumentTypeType,
  SOWIncomeDestinationType,
} from '../../../../types/generated/sow'

import { StepComponentCommonProps } from '../../types'
import { IncomeSourceContext } from '../../providers'
import { getAccountOptions } from './constants'

export const AccountQuestion: FC<StepComponentCommonProps> = ({
  onForward,
  onAdditional,
  onBack,
}) => {
  const { t } = useTranslation(I18nNamespace.FormsAccountQuestion)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)

  const {
    documentTypes,
    documents,
    incomeDestination,
    setIncomeDestination,
    setCurrentDocumentType,
  } = useContext(IncomeSourceContext)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIncomeDestination(e.target.value as SOWIncomeDestinationType)
  }

  const onContinue = () => {
    const isRevo = incomeDestination === SOWIncomeDestinationType.Revolut

    if (!isRevo) {
      setCurrentDocumentType(SOWDocumentTypeType.BankStatement)
      onAdditional()
      return
    }

    const emptyType = getEmptyType(documentTypes, documents)
    const isBankStatement = emptyType === SOWDocumentTypeType.BankStatement

    if (emptyType && !isBankStatement) {
      setCurrentDocumentType(emptyType)
      onAdditional()
      return
    }

    onForward()
  }

  const isDisabled = !incomeDestination

  return (
    <>
      <Main>
        <Header onBack={onBack} description={t('title')}>
          {t('description')}
        </Header>

        <EntityBlock>
          <RadioSelect
            options={getAccountOptions(t)}
            onChange={handleChange}
            name="incomeDestination"
            value={incomeDestination}
            isTouched
          />
        </EntityBlock>
      </Main>

      <Layout.Actions>
        <Button disabled={isDisabled} type="button" onClick={onContinue} elevated>
          {tCommon('continue')}
        </Button>
      </Layout.Actions>
    </>
  )
}
