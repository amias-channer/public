import React, { useState } from "react"
import styled from "styled-components"
import Loader from "../../design-system/Loader/Loader.react"

interface Props {
  url: string
  className?: string
  allow?: string
}

export const IFrame = ({ url, className, allow }: Props) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)

  return (
    <DivContainer className={className}>
      <div className="IFrame--exchange">
        <iframe
          allow={allow}
          className="IFrame--iframe"
          src={url}
          onLoad={() => setIsIframeLoaded(true)}
        />

        {isIframeLoaded ? null : (
          <div className="IFrame--loader">
            <Loader size="large" />
          </div>
        )}
      </div>
    </DivContainer>
  )
}

export default IFrame

const DivContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  height: 100%;

  .IFrame--exchange {
    position: relative;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.colors.border};
    height: 100%;
  }

  .IFrame--iframe {
    border: 0;
    border-radius: 10px;
    margin: 0 auto;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .IFrame--loader {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
