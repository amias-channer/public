import capitalize from 'lodash/capitalize'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import * as Icons from '@revolut/icons'
import { Box, Button, Details, Flex, Group, Popup, Text } from '@revolut/ui-kit'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { UserTopupCardDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../../../constants'
import { patchCardIssuer } from '../../../utils'
import { useRemoveExternalCard } from '../../hooks'
import { formatExpiryDate, formatCardBrandAndNumber } from './utils'

type CardInfoPopupScreenProps = {
  card: UserTopupCardDto
  onGoBack: VoidFunction
}

export const CardInfoPopupScreen: FC<CardInfoPopupScreenProps> = ({ card, onGoBack }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const queryClient = useQueryClient()
  const { removeExternalCard, isRemovingExternalCard } = useRemoveExternalCard()

  const handleDeleteCardButtonClick = () => {
    removeExternalCard(card.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.UserTopupCards).then(onGoBack)

        trackEvent(TopUpTrackingEvent.topUpLinkedCardDeleted, {
          linkedCardId: card.id,
        })
      },
    })
  }

  const issuerName =
    patchCardIssuer(card.issuer.name) ??
    t('TopUpMethodsScreen.section.linkedCards.undefinedBank')

  useEffect(() => {
    trackEvent(TopUpTrackingEvent.topUpLinkedCardInfoPopupShown, {
      linkedCardId: card.id,
    })
  }, [card.id])

  return (
    <>
      <Popup.Header>
        <Popup.BackButton onClick={onGoBack} />
        <Popup.Title>{issuerName}</Popup.Title>
        <Popup.Description>{formatCardBrandAndNumber(card)}</Popup.Description>
      </Popup.Header>

      <Box mt="-s-8">
        <Button
          useIcon={Icons.Cross}
          variant="secondary"
          size="sm"
          disabled={isRemovingExternalCard}
          onClick={handleDeleteCardButtonClick}
        >
          {t(
            'facelift.TopUpMethodsScreen.MethodSelect.CardInfoPopupScreen.deleteButtonText',
          )}
        </Button>
      </Box>

      <Flex mt="32px" mb="16px">
        <Text flex="1" color="grey-tone-50" variant="h6" use="h6">
          {t(
            'facelift.TopUpMethodsScreen.MethodSelect.CardInfoPopupScreen.cardDetails.groupTitle',
          )}
        </Text>
      </Flex>

      <Group>
        <Box px="s-16">
          <Details>
            <Details.Title>
              {t(
                'facelift.TopUpMethodsScreen.MethodSelect.CardInfoPopupScreen.cardDetails.cardItemTitle',
              )}
            </Details.Title>
            <Details.Content>{issuerName}</Details.Content>
          </Details>

          <Details>
            <Details.Title>
              {t(
                'facelift.TopUpMethodsScreen.MethodSelect.CardInfoPopupScreen.cardDetails.cardTypeTitle',
              )}
            </Details.Title>
            <Details.Content>{capitalize(card.issuer.cardType)}</Details.Content>
          </Details>

          <Details>
            <Details.Title>
              {t(
                'facelift.TopUpMethodsScreen.MethodSelect.CardInfoPopupScreen.cardDetails.validUntilTitle',
              )}
            </Details.Title>
            <Details.Content>{formatExpiryDate(card.expiryDate)}</Details.Content>
          </Details>
        </Box>
      </Group>
    </>
  )
}
