import React from "react"
import styled from "styled-components"
import Drawer, { DrawerProps, renderChildren } from "../../design-system/Drawer"
import Flex from "../../design-system/Flex"
import { Media } from "../../design-system/Media"
import Text from "../../design-system/Text"
import UnstyledButton from "../../design-system/UnstyledButton"
import { useTranslations } from "../../hooks/useTranslations"
import { $nav_height } from "../../styles/variables"
import Icon from "../common/Icon.react"
import VerticalAligned from "../common/VerticalAligned.react"

type Props = Omit<
  DrawerProps,
  "navbarOffset" | "isBannerShown" | "onClickAway"
> & {
  onClose: () => unknown
  clearAll: () => unknown
}

export const FilterDrawer = ({
  children,
  onClose,
  clearAll,
  ...rest
}: Props) => {
  const { tr } = useTranslations()
  return (
    <StyledDrawer
      isBannerShown={false}
      navbarOffset={$nav_height}
      onClickAway={onClose}
      {...rest}
    >
      {props => (
        <>
          <Drawer.Header>
            <Flex alignItems="center">
              <VerticalAligned marginRight="8px">
                <Icon value="filter_list" />
              </VerticalAligned>
              <Text as="span" variant="bold">
                {tr("Filter")}
              </Text>
            </Flex>

            <UnstyledButton aria-label="Close" onClick={onClose}>
              <Icon color="gray" cursor="pointer" value="close" />
            </UnstyledButton>
          </Drawer.Header>
          <Drawer.Body>
            <Media greaterThan={props.fullscreenBreakpoint}>
              {(mediaClassNames, renderChildren) =>
                renderChildren && (
                  <Flex className={mediaClassNames} marginBottom="20px">
                    <UnstyledButton onClick={clearAll}>
                      <Text as="span" color="primary">
                        {tr("Clear all")}
                      </Text>
                    </UnstyledButton>
                  </Flex>
                )
              }
            </Media>

            {renderChildren(children, props)}
          </Drawer.Body>
        </>
      )}
    </StyledDrawer>
  )
}

const StyledDrawer = styled(Drawer)`
  .Panel--panel {
    margin-bottom: 16px;
  }
` as typeof Drawer
