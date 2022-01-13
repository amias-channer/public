import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Header, Avatar } from '@revolut/ui-kit'
import { generatePath, useHistory } from 'react-router-dom'

import { Pocket } from '@revolut/rwa-core-types'
import { checkRequired, getAsset, AssetProject, Url } from '@revolut/rwa-core-utils'
import { Balance } from '@revolut/rwa-core-components'

import { getPocketName, getCountry } from './helpers'
import { ActionsBar } from './ActionsBar'

type AccountHeaderProps = {
  pocket?: Pocket
  onBackButtonClick: VoidFunction
}

export const AccountHeaderUDS: FC<AccountHeaderProps> = ({
  pocket,
  onBackButtonClick,
}) => {
  const history = useHistory()
  const { t } = useTranslation('domain')

  const pocketName = getPocketName(t, pocket)
  const country = getCountry(pocket)
  const logo = getAsset(`flags/${country}.svg`, AssetProject.Business)

  const navigateToStatement = () => {
    history.push(
      generatePath(Url.AccountStatement, {
        id: checkRequired(pocket?.id, 'pocket can not be empty'),
      }),
    )
  }

  return (
    <Header variant="item">
      <Header.BackButton onClick={onBackButtonClick} />
      <Header.Title>
        {pocket && <Balance amount={pocket.balance} currency={pocket.currency} />}
      </Header.Title>
      <Header.Avatar>
        <Avatar image={logo} size={56} />
      </Header.Avatar>
      <Header.Subtitle>
        <Text variant="secondary" color="grey-50">
          <Text data-testid="account-currency" color="black">
            {pocketName}
          </Text>
        </Text>
      </Header.Subtitle>

      <Header.Bar>
        <ActionsBar onStatementClick={navigateToStatement} />
      </Header.Bar>
    </Header>
  )
}
