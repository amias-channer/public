import React from "react"
import styled from "styled-components"
import Image from "../components/common/Image.react"
import { I18N_FLAGS, Language, LANGUAGES } from "../constants"
import { Block } from "../design-system/Block"
import UnstyledButton from "../design-system/UnstyledButton"
import useAppContext from "../hooks/useAppContext"
import I18n from "./i18n"

interface Props {
  className?: string
  language: Language
  onClose?: () => unknown
  as?: keyof JSX.IntrinsicElements | React.ComponentType
}

const LanguagePicker = ({
  className,
  language,
  onClose,
  as = UnstyledButton,
}: Props) => {
  const { updateContext } = useAppContext()
  return (
    <StyledContainer
      as={as}
      className={className}
      onClick={() => {
        updateContext({ language })
        I18n.setLanguage(language)
        onClose?.()
      }}
    >
      <Image
        className="LanguagePicker--image"
        height={24}
        sizing="fill"
        url={I18N_FLAGS[language]}
        width={36}
      />{" "}
      {LANGUAGES[language]}
    </StyledContainer>
  )
}

export default LanguagePicker

const StyledContainer = styled(Block)`
  align-items: center;
  display: flex;
  width: 100%;

  .LanguagePicker--image {
    box-shadow: 0 0 1px 1px ${props => props.theme.colors.border};
    margin-right: 16px;
  }
`
