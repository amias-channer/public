import { UnifiedTheme } from '@revolut/ui-kit'

const modalViewStyles = UnifiedTheme?.popupStyles?.['modal-view'] || {}

const theme = {
  ...UnifiedTheme,
  popupStyles: {
    ...UnifiedTheme?.popupStyles,
    'modal-view': {
      ...modalViewStyles,
      zIndex: 1,
    },
  },
}

export default theme
