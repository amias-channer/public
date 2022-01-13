import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icon from '@revolut/icons'
import { List, Text, Widget } from '@revolut/ui-kit'

import { UserCompany, RevolutBankAccount } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { LightBulbIcon } from '../../../Icons'
import { getHints, IconType } from './getHints'

const ICON_BY_TYPE = {
  [IconType.Coins]: <Icon.Coins />,
  [IconType.Flag]: <Icon.Flag />,
  [IconType.Insurance]: <Icon.Insurance />,
  [IconType.LightBulb]: <LightBulbIcon />,
  [IconType.Time]: <Icon.Time />,
  [IconType.Warning]: <Icon.Warning />,
  [IconType.Globe]: <Icon.Globe />,
  [IconType.Info]: <Icon.Info />,
}

type HintsProps = {
  accountDetails: RevolutBankAccount
  userCompany: UserCompany
}

export const Hints: FC<HintsProps> = ({ accountDetails, userCompany }) => {
  const { t, i18n } = useTranslation(I18nNamespace.Domain)
  const hints = getHints(accountDetails, userCompany, t, i18n)

  return (
    <Widget>
      <List px="16px">
        {hints.map((hint, index) => {
          const hintKey = `${hint.icon}-${index}`

          return (
            <List.Item
              key={hintKey}
              useIcon={() => ICON_BY_TYPE[hint.icon]}
              data-testid={`accountHintsIcon-${hint.icon}`}
            >
              <Text use="p" variant="caption">
                {hint.title}
              </Text>
            </List.Item>
          )
        })}
      </List>
    </Widget>
  )
}
