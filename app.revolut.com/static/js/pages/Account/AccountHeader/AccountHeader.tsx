import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Box, H1 } from '@revolut/ui-kit'

import { Pocket } from '@revolut/rwa-core-types'

import { Balance } from '@revolut/rwa-core-components'
import { Header } from 'pages/AccountsPage/Header'

import { getPocketName, getCountry } from './helpers'
import { CountryFlagStyled } from './styled'

type AccountHeaderProps = {
  pocket?: Pocket
}

export const AccountHeader: FC<AccountHeaderProps> = ({ pocket }) => {
  const { t } = useTranslation('domain')

  const pocketName = getPocketName(t, pocket)
  const country = getCountry(pocket)

  return (
    <Header
      data-testid="account-details-header"
      info={
        <Box>
          {pocket && pocket.currency ? (
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <H1>
                  <Balance amount={pocket.balance} currency={pocket.currency} />
                </H1>
                {pocket && pocket.currency ? (
                  <Box color="grey-35" mt="4px">
                    {pocketName}
                  </Box>
                ) : null}
              </Box>
              {country && <CountryFlagStyled size={56} country={country} />}
            </Flex>
          ) : (
            <Box height="7.6rem" />
          )}
        </Box>
      }
    />
  )
}
