import React, { useState } from "react"
import styled from "styled-components"
import Button from "../../design-system/Button"
import Flex from "../../design-system/Flex"
import { useTranslations } from "../../hooks/useTranslations"
import { themeVariant } from "../../styles/styleUtils"
import EmailInput from "../forms/EmailInput.react"

export const MailingSignupForm = () => {
  const { tr } = useTranslations()
  const [value, setValue] = useState<string>()
  const [inputValue, setInputValue] = useState("")

  return (
    <Container>
      <Flex width="100%">
        <EmailInput
          containerClassName="MailingSignupForm--input"
          inputValue={inputValue}
          placeholder="Your email address"
          value={value}
          onChange={({ value, inputValue }) => {
            setValue(value)
            setInputValue(inputValue)
          }}
        />
      </Flex>
      <Button
        className="MailingSignupForm--button"
        height="50px"
        href={
          value
            ? `https://opensea.io/blog/newsletter?email=${value}`
            : undefined
        }
        width="162px"
      >
        {tr("Sign up")}
      </Button>
    </Container>
  )
}

export default MailingSignupForm

const Container = styled(Flex)`
  width: 100%;
  margin-top: 16px;

  ${props =>
    themeVariant({
      variants: {
        light: {
          color: props.theme.colors.oil,
        },
        dark: {
          color: props.theme.colors.fog,
        },
      },
    })}

  .MailingSignupForm--input {
    width: 100%;
    padding-right: 8px;
  }

  .MailingSignupForm--button:hover {
    filter: brightness(1.1);
    border: 0;
    background-color: ${props => props.theme.colors.primary};
  }
`
