// import React from "react"
import styled from "styled-components"

const NoticeBanner = styled.div`
  align-items: center;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  font-size: 14px;
  justify-content: center;
  padding: 10px 20px;
  position: relative;
  text-align: center;
  white-space: initial;
  width: 100%;
`
export default NoticeBanner
