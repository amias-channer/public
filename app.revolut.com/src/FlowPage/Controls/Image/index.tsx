import React, { FC } from 'react'
import { Box } from '@revolut/ui-kit'
import styled from 'styled-components'

import { Img } from './styled'

type Props = {
  url: string
}

const StyledImageBox = styled(Box)`
  width: 100%;
  text-align: center;
`
export const IMAGE_TESTID = 'image-testid'

const Image: FC<Props> = ({ url }) => {
  return (
    <StyledImageBox>
      <Img src={url} alt="" data-testid={IMAGE_TESTID} />
    </StyledImageBox>
  )
}

export default Image
