import React, { Component } from "react"
import styled from "styled-components"
import Loader from "../../design-system/Loader/Loader.react"

interface Props {
  className?: string
}

export default class ModalLoader extends Component<Props> {
  render() {
    const { className } = this.props
    return (
      <DivContainer className={className}>
        <Loader size="large" />
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  width: 100%;
  min-width: 300px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
`
