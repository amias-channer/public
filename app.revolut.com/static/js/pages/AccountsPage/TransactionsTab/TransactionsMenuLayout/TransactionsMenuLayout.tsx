import { FC } from 'react'
import { Flex } from '@revolut/ui-kit'

import { ChainWithSingleSpaceSeparator } from './styled'

type TransactionsMenuLayoutProps = {
  aside?: React.ReactNode
  children: React.ReactElement[]
  isRestrictedAccessToken?: boolean
}

const getChainProps = (isRestrictedAccessToken?: boolean) =>
  isRestrictedAccessToken
    ? {
        style: { pointerEvents: 'none' },
        textStyle: 'primary',
      }
    : {
        textStyle: 'primary',
        fontWeight: 'bolder',
      }

export const TransactionsMenuLayout: FC<TransactionsMenuLayoutProps> = ({
  aside,
  children,
  isRestrictedAccessToken,
}) => {
  const chainProps = getChainProps(isRestrictedAccessToken)

  return (
    <Flex justifyContent="space-between">
      <Flex
        flexDirection={{ all: 'column', md: 'row' }}
        alignItems={{ all: 'start', md: 'center' }}
      >
        {/*
        // @ts-expect-error */}
        <ChainWithSingleSpaceSeparator color="grey-35" {...chainProps}>
          {children}
        </ChainWithSingleSpaceSeparator>
      </Flex>
      {aside && <Flex alignItems="center">{aside}</Flex>}
    </Flex>
  )
}
