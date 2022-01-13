import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Absolute, Box, TabBar, TransitionCollapse, Relative } from '@revolut/ui-kit'

import { I18nNamespace } from '@revolut/rwa-core-utils'
import { PricingPlanCode } from '@revolut/rwa-core-types'

import { PricingPlansTabsBase } from './styled'

type PricingPlansTabsProps = {
  currentTabIndex: number
  pricingPlansCodes: PricingPlanCode[]
  visible: boolean
  onTabChange: (index: number) => void
}

const TRANSITION_DURATION = 200

export const PricingPlansTabs: FC<PricingPlansTabsProps> = ({
  currentTabIndex,
  pricingPlansCodes,
  visible,
  onTabChange,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return (
    <PricingPlansTabsBase mt="-0.5rem" top="32px">
      <Relative>
        <Absolute
          top={0}
          left={0}
          right={0}
          mx="-1.5rem"
          px="1.5rem"
          bg="grouped-background"
        >
          <TransitionCollapse
            duration={TRANSITION_DURATION}
            enterAnimation={{
              opacity: {
                value: 1,
              },
            }}
            exitAnimation={{
              opacity: {
                value: 1,
              },
            }}
            in={visible}
          >
            <Box height="64px" py="16px">
              <TabBar variant="segmented">
                {pricingPlansCodes.map((pricingPlanCode, index) => (
                  <TabBar.Item
                    key={pricingPlanCode}
                    use="button"
                    aria-selected={currentTabIndex === index}
                    onClick={() => onTabChange(index)}
                  >
                    {t(`plans.${pricingPlanCode.toLowerCase()}.name`)}
                  </TabBar.Item>
                ))}
              </TabBar>
            </Box>
          </TransitionCollapse>
        </Absolute>
      </Relative>
    </PricingPlansTabsBase>
  )
}
