import React from "react"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Flex from "../../design-system/Flex"
import Tooltip from "../../design-system/Tooltip"
import { themeVariant } from "../../styles/styleUtils"
import Link from "./Link.react"
import { sizeMQ } from "./MediaQuery.react"

interface Props {
  icon: React.ReactNode
  tooltip?: string
  label?: string
  url?: string
  className?: string
}

const InfoItem = ({ icon, tooltip, label, url, className }: Props) => {
  const InfoElement = <Info className={className} icon={icon} label={label} />
  return (
    <Tooltip content={tooltip} disabled={!tooltip}>
      <BlockContainer>
        {url ? (
          <Link eventSource={label} href={url}>
            {InfoElement}
          </Link>
        ) : (
          InfoElement
        )}
      </BlockContainer>
    </Tooltip>
  )
}

export default InfoItem

const BlockContainer = styled(Block)`
  border-right: 1px solid ${props => props.theme.colors.border};

  &:last-of-type,
  &:nth-child(2) {
    border-right: none;
  }

  ${sizeMQ({
    medium: css`
      &:last-of-type {
        border-radius: 5px;
      }

      &:nth-child(2) {
        border-right: 1px solid ${props => props.theme.colors.border};
      }
    `,
  })}
`

const Info = ({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode
  label?: string
  className?: string
}) => (
  <Container className={className}>
    <Flex className="Info--icon">{icon}</Flex>
    {label ? (
      <Block fontSize="14px" marginTop="8px">
        {label}
      </Block>
    ) : null}
  </Container>
)

const Container = styled(Flex)`
  height: 50px;
  width: 50px;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  justify-content: center;
  padding: 10px 0;
  text-align: center;

  ${props =>
    themeVariant({
      variants: {
        light: {
          color: props.theme.colors.gray,
        },
        dark: {
          color: props.theme.colors.fog,
        },
      },
    })}

  &:hover {
    transition: 0.2s;
    box-shadow: ${props => props.theme.shadow};
  }

  .Info--icon {
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    height: 20px;
    justify-content: center;
  }
`
