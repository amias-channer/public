import isEmpty from 'lodash/isEmpty'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Popup, Image, Group } from '@revolut/ui-kit'

import { BaseModalProps, Spacer, useModal } from '@revolut/rwa-core-components'
import {
  PlanInsuranceReviewDetailsConditionDto,
  PlanInsuranceReviewDetailsDataDto,
  PlanInsuranceReviewDetailsDocumentsDto,
  PricingPlanDto,
} from '@revolut/rwa-core-types'
import { getAsset, useLatestRef, openUrlInNewTab } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../constants'
import { DisclosureItem } from './DisclosureItem'
import { useGetPlanInsuranceReviewDetails } from './hooks'
import { InsuranceTermsItem } from './InsuranceTermsItem'
import { MultipleDocumentsPopup } from './MultipleDocumentsPopup'
import { PolicyConditions } from './PolicyConditions'
import { SuitabilityStatementPopup } from './SuitabilityStatementPopup'

type PricingPlanInsuranceDetailsPopupProps = {
  pricingPlan: PricingPlanDto
  onAccepted: VoidFunction
} & BaseModalProps

type CombinedDocumentItem = {
  type: string
  documents: PlanInsuranceReviewDetailsDocumentsDto
}

const getCombinedDocuments = (
  detailsData: PlanInsuranceReviewDetailsDataDto[],
): CombinedDocumentItem[] => {
  return detailsData.map((details) => ({
    type: details.type,
    documents: details.documents,
  }))
}

const getCombinedConditions = (detailsData: PlanInsuranceReviewDetailsDataDto[]) => {
  const initialValue: PlanInsuranceReviewDetailsConditionDto[] = []

  return detailsData.reduce((prev, details) => {
    return prev.concat(details.conditions)
  }, initialValue)
}

export const PricingPlanInsuranceDetailsPopup: FC<PricingPlanInsuranceDetailsPopupProps> =
  ({ isOpen, pricingPlan, onAccepted, onRequestClose }) => {
    const { t } = useTranslation(I18_NAMESPACE)

    const [acceptedConditions, setAcceptedConditions] = useState<string[]>([])
    const [termsAccepted, setTermsAccepted] = useState(false)

    const onAcceptedRef = useLatestRef(onAccepted)

    const { planInsuranceReviewDetails } = useGetPlanInsuranceReviewDetails(
      pricingPlan.id,
    )
    const [showProductSummaryPopup, productSummaryPopupProps] = useModal()
    const [showTermsPopup, termsPopupProps] = useModal()
    const [showSuitabilityStatementPopup, suitabilityStatementProps] = useModal()

    const handleAcceptedTerms = useCallback(() => {
      if (!onAcceptedRef.current) {
        return
      }

      onRequestClose()
      onAcceptedRef.current()
    }, [onAcceptedRef, onRequestClose])

    useEffect(() => {
      if (
        isOpen &&
        planInsuranceReviewDetails &&
        !planInsuranceReviewDetails.isReviewRequired
      ) {
        handleAcceptedTerms()
      }
    }, [isOpen, handleAcceptedTerms, planInsuranceReviewDetails])

    const detailsData = planInsuranceReviewDetails?.data ?? []

    const combinedDocumentItems = getCombinedDocuments(detailsData)

    const combinedConditions = getCombinedConditions(detailsData)

    const openProductSummaryTerms = () => {
      if (combinedDocumentItems.length > 1) {
        showProductSummaryPopup()
      } else {
        openUrlInNewTab(combinedDocumentItems[0].documents.policySummaryUrl)
      }
    }

    const openInsurancePolicyWordingTerms = () => {
      if (combinedDocumentItems.length > 1) {
        showTermsPopup()
      } else {
        openUrlInNewTab(combinedDocumentItems[0].documents.termsUrl)
      }
    }

    const handleInsuranceTermsAcceptedChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setTermsAccepted(event.target.checked)
    }

    const isButtonEnabled =
      acceptedConditions.length === combinedConditions.length && termsAccepted

    const suitabilityStatementItems =
      planInsuranceReviewDetails?.suitabilityStatement ?? []

    return (
      <>
        <Popup isOpen={isOpen} variant="modal-view" onExit={onRequestClose}>
          <Popup.Header>
            <Popup.CloseButton aria-label="Close insurance details" />
            <Popup.Title>
              {t('PricingPlanInsuranceDetails.PricingPlanInsuranceDetailsPopup.title')}
            </Popup.Title>
          </Popup.Header>
          <Image
            size={200}
            m="auto"
            role="presentation"
            src={getAsset('pricing_plans/insurance_details/checklist-pencil.png')}
          />
          {planInsuranceReviewDetails && (
            <>
              <Group>
                {combinedDocumentItems.some((documentItem) =>
                  Boolean(documentItem.documents.policySummaryUrl),
                ) && (
                  <DisclosureItem
                    title={t('PricingPlanInsuranceDetails.product_summary')}
                    onClick={openProductSummaryTerms}
                  />
                )}
                {combinedDocumentItems.some((documentItem) =>
                  Boolean(documentItem.documents.termsUrl),
                ) && (
                  <DisclosureItem
                    title={t('PricingPlanInsuranceDetails.insurance_policy_wording')}
                    onClick={openInsurancePolicyWordingTerms}
                  />
                )}
                {!isEmpty(suitabilityStatementItems) && (
                  <DisclosureItem
                    title={t('PricingPlanInsuranceDetails.suitability_statement')}
                    onClick={showSuitabilityStatementPopup}
                  />
                )}
              </Group>
              <Spacer h="12px" />
            </>
          )}
          {!isEmpty(combinedConditions) && (
            <>
              <PolicyConditions
                conditions={combinedConditions}
                onAcceptedChange={setAcceptedConditions}
              />
              <Spacer h="12px" />
            </>
          )}

          <InsuranceTermsItem
            onAcceptedChange={handleInsuranceTermsAcceptedChange}
            onTermsButtonClick={openInsurancePolicyWordingTerms}
          />

          <Popup.Actions>
            <Button elevated disabled={!isButtonEnabled} onClick={handleAcceptedTerms}>
              {t('PricingPlanInsuranceDetails.PricingPlanInsuranceDetailsPopup.cta')}
            </Button>
          </Popup.Actions>
        </Popup>

        <MultipleDocumentsPopup
          title={t('PricingPlanInsuranceDetails.product_summary')}
          items={combinedDocumentItems.map((documentItem) => ({
            type: documentItem.type,
            docUrl: documentItem.documents.policySummaryUrl,
          }))}
          {...productSummaryPopupProps}
        />
        <MultipleDocumentsPopup
          title={t('PricingPlanInsuranceDetails.insurance_policy_wording')}
          items={combinedDocumentItems.map((documentItem) => ({
            type: documentItem.type,
            docUrl: documentItem.documents.termsUrl,
          }))}
          {...termsPopupProps}
        />
        {!isEmpty(suitabilityStatementItems) && (
          <SuitabilityStatementPopup
            items={suitabilityStatementItems}
            {...suitabilityStatementProps}
          />
        )}
      </>
    )
  }
