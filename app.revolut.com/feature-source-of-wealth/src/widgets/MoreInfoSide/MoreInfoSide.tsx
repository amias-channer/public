import { FC } from 'react'
import { noop } from 'lodash'
import { Trans, useTranslation } from 'react-i18next'

import { Side, Link, Group, Item, Header, SideProps } from '@revolut/ui-kit'
import { InfoOutline } from '@revolut/icons'

import { I18nNamespace, I18N_VERIFICATIONS_NAMESPACE } from '../../utils'
import { getSideTextBlocks } from './utils'

export const MoreInfoSide: FC<SideProps> = ({ isOpen = false, onExit = noop }) => {
  const { t } = useTranslation(I18N_VERIFICATIONS_NAMESPACE)

  return (
    <Side isOpen={isOpen} onExit={onExit}>
      <Header variant="item">
        <Header.CloseButton aria-label="Close" />
        <Header.Title>{t(`${I18nNamespace.WidgetMoreInfoSide}.title`)}</Header.Title>
      </Header>

      <Group>
        {getSideTextBlocks(t).map(({ text, title }) => (
          <Item key={title} useIcon={InfoOutline} iconColor="black">
            <Item.Content>
              <Item.Title>{title}</Item.Title>
              <Item.Description>
                <Trans
                  t={t}
                  i18nKey={text}
                  components={{ a: <Link target="_blank" title="Visit blog" /> }}
                />
              </Item.Description>
            </Item.Content>
          </Item>
        ))}
      </Group>
    </Side>
  )
}
