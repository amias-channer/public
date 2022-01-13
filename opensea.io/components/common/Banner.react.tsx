import React from "react"
import styled from "styled-components"
import Loader from "../../design-system/Loader/Loader.react"
import Image from "./Image.react"

interface Props {
  children?: React.ReactNode
  className?: string
  imageUrl?: string
  loading?: boolean
}

const Banner = ({ children, className, imageUrl, loading }: Props) => (
  <DivContainer className={className}>
    {loading ? (
      <div className="Banner--loader">
        <Loader size="large" />
      </div>
    ) : imageUrl ? (
      <Image
        className="Banner--image"
        height={600}
        sizing="cover"
        url={imageUrl}
      >
        <div className="Banner--content">{children}</div>
      </Image>
    ) : (
      <div className="Banner--content">{children}</div>
    )}
  </DivContainer>
)
export default Banner

const DivContainer = styled.div`
  display: flex;
  min-height: 120px;
  height: 300px;
  overflow: hidden;
  position: relative;

  background-color: ${props => props.theme.colors.border};

  .Banner--image {
    width: 100%;
    border-radius: 0;
  }

  .Banner--loader {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 60px;
  }

  .Banner--content {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 20px;
    width: 100%;
  }
`
