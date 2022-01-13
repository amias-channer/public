// Needed to prevent regeneratorRuntime is not defined error
import "regenerator-runtime/runtime"
import React from "react"
import { RRNLRequestError } from "react-relay-network-modern"
import styled from "styled-components"
import { flatMap } from "../../lib/helpers/array"
import { capitalize } from "../../lib/helpers/stringUtils"

interface Props {
  className?: string
  error: RRNLRequestError
}

// TODO: Remove and use AppComponent#showError instead
const GraphQLError = ({ className, error }: Props) => {
  const errors = error.res?.errors
  if (!errors) {
    return null
  }
  return (
    <UlContainer className={className}>
      {flatMap(errors, e => {
        try {
          return Object.entries<string[]>(JSON.parse(e.message)).map(
            ([key, values]) => `${capitalize(key)}: ${values.join(" ")}`,
          )
        } catch (_) {
          return [e.message]
        }
      }).map(message => (
        <li key={message}>{message}</li>
      ))}
    </UlContainer>
  )
}
export default GraphQLError

const UlContainer = styled.ul`
  color: red;
  display: flex;
  flex-direction: column;
  margin: 0;
`
