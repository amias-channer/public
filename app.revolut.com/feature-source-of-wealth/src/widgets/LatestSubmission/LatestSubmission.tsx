import { FC, useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import noop from 'lodash/noop'
import { Spacer } from '@revolut/rwa-core-components'
import {
  SOTLatestSubmission,
  SOWLatestSubmission,
  SOWLatestSubmissionEvidences,
  SOTLatestSubmissionEvidences,
} from 'types'

import {
  EntityBlock,
  IncomeSourceItem,
  EntityAdd,
  EntityBlockProps,
} from '../../components'
import { I18nNamespace, isRequested } from '../../utils'
import { useTranslation } from '../../hooks'

type LatestSubmissionProps = {
  submissionLatest?: SOWLatestSubmission | SOTLatestSubmission
  onOpenSide: (
    evidence: SOWLatestSubmissionEvidences | SOTLatestSubmissionEvidences,
  ) => void
  onAdd?: VoidFunction
  withAdd?: boolean
} & EntityBlockProps

export const LatestSubmission: FC<LatestSubmissionProps> = ({
  submissionLatest,
  onOpenSide,
  onAdd = noop,
  withAdd = false,
  ...entityBlockProps
}) => {
  const { t } = useTranslation(I18nNamespace.WidgetLatestSubmission)

  const isEmptyEvidences = isEmpty(submissionLatest?.evidences)
  const isRequest = isRequested(submissionLatest?.actionToDo?.action)

  const canAdd = useMemo(() => {
    if (isRequest) {
      return true
    }

    if (!submissionLatest) {
      return withAdd
    }

    return submissionLatest?.canAddSource && withAdd
  }, [submissionLatest, withAdd, isRequest])

  const showWidget = !isEmptyEvidences || canAdd
  const entityTitle = showWidget ? t('title') : undefined

  return (
    <>
      <EntityBlock title={entityTitle} {...entityBlockProps}>
        {canAdd && (
          <EntityAdd color="primary" onClick={onAdd}>
            {t('IncomeSource.add')}
          </EntityAdd>
        )}

        {submissionLatest?.evidences?.map(
          (evidence: SOWLatestSubmissionEvidences | SOTLatestSubmissionEvidences) => (
            <IncomeSourceItem
              key={evidence?.id}
              onClick={() => onOpenSide(evidence)}
              amount={evidence?.amount}
              frequency={evidence?.incomeFrequency?.title}
              reviewState={evidence?.reviewState}
            >
              {evidence?.incomeSource?.title}
            </IncomeSourceItem>
          ),
        )}
      </EntityBlock>

      {showWidget && <Spacer h="s-16" />}
    </>
  )
}
