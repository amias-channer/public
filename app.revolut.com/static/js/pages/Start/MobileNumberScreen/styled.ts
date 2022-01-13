import styled from 'styled-components'
import { Box, mq } from '@revolut/ui-kit'

import {
  AuthLayout,
  AuthLayoutButtonsBox as ButtonsBox,
} from '@revolut/rwa-core-components'
import { media, themeColor, themeNamespace, themeSpace } from '@revolut/rwa-core-styles'
import { LanguageSelector } from '@revolut/rwa-core-navigation'

const CONTAINER_SPACE_DESKTOP = themeSpace('px32')
const CONTAINER_SPACE_TABLET = themeSpace('px16')
const INNER_CONTAINER_SPACE = themeSpace('authLayoutInnerSpace')

const { themeSize } = themeNamespace('pages.Start')

export const AuthLayoutStyled = styled(AuthLayout)`
  @media ${mq('*-xl')} {
    min-height: ${themeSize('AuthLayout.minHeight.lg')};
    padding-bottom: ${themeSpace('px56')};

    ${ButtonsBox} {
      bottom: ${themeSpace('px80')};
    }
  }
`
export const LanguageSelectorContainer = styled(Box)`
  @media ${mq('xl')} {
    position: absolute;
    bottom: ${themeSpace('px48')};
    right: ${CONTAINER_SPACE_DESKTOP};
  }

  @media ${mq('*-xl')} {
    margin-top: ${themeSpace('px32')};
    margin-left: calc(${INNER_CONTAINER_SPACE} + ${CONTAINER_SPACE_DESKTOP});
  }

  ${media.tabletMax`
    margin-left: ${CONTAINER_SPACE_TABLET};
  `}
`

export const LanguageSelectorStyled = styled(LanguageSelector)`
  @media ${mq('xl')} {
    color: ${themeColor('languagePickerLabelDark')};
  }
`
