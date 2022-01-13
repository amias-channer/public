import merge from 'lodash/merge'
import { darken, transparentize } from 'polished'
import {
  COLORS as UI_KIT_COLORS,
  BREAKPOINTS as UI_KIT_BREAKPOINTS,
} from '@revolut/ui-kit'

import { FaceliftTheme } from './faceliftTheme'
import { BasierCircle } from './fonts'
import { ThemeProps } from './types'
import { rem } from './utils'

export const BREAKPOINTS = Object.assign([], {
  mobile: UI_KIT_BREAKPOINTS.sm as string,
  tablet: '720px',
})

export const COLORS = {
  overlay: 'rgba(0, 0, 0, 0.3)',
  primary: '#0666EB',
  primaryBlack: UI_KIT_COLORS.black,
  primaryError: '#F54C3E',
  primaryWhite: '#FFFFFF',
}

export const COLOR_STYLES = {
  accountDetailsDarkBg: UI_KIT_COLORS['grey-100'],
  accountDetailsLightBg: COLORS.primaryWhite,
  accountsPendingActionsTitle: UI_KIT_COLORS['grey-50'],
  buttonBorder: UI_KIT_COLORS['grey-90'],
  buttonToShowSidebar: UI_KIT_COLORS['grey-50'],
  cardActivationInfoIcon: COLORS.primary,
  cardDeliveryDetailsSummaryTitle: UI_KIT_COLORS['grey-50'],
  cardDeliveryPriceReduced: UI_KIT_COLORS['grey-50'],
  cardLabelText: COLORS.primaryBlack,
  cardOrderingArrivalDate: UI_KIT_COLORS['grey-50'],
  cardOrderingSummaryRowTitle: UI_KIT_COLORS['grey-50'],
  cardPlaceholderBackground: UI_KIT_COLORS['grey-100'],
  cardPlaceholderLoader: UI_KIT_COLORS['grey-90'],
  cardPlaceholderSkeletonBackground: UI_KIT_COLORS['grey-95'],
  cardSettingsNotificationText: UI_KIT_COLORS['grey-35'],
  cardSettingsNotificationTitle: COLORS.primaryBlack,
  cardSettingsSectionItemDescription: UI_KIT_COLORS['grey-50'],
  cardSettingsSectionTitle: UI_KIT_COLORS['grey-50'],
  cardSettingsSubtitle: UI_KIT_COLORS['grey-35'],
  cardSettingsSubtitleFrozen: UI_KIT_COLORS['grey-80'],
  cardSettingsTitleFrozen: UI_KIT_COLORS['grey-50'],
  cardStateLabel: UI_KIT_COLORS['grey-35'],
  cardStateWarning: UI_KIT_COLORS.accent,
  codeInputSeparator: UI_KIT_COLORS['grey-50'],
  cookiesBannerBackground: UI_KIT_COLORS['grey-95'],
  cookiesBannerText: UI_KIT_COLORS['grey-50'],
  countdownCircleBackgroundCircle: UI_KIT_COLORS['grey-90'],
  countdownCircleAnimatedCircle: COLORS.primary,
  default: UI_KIT_COLORS['grey-35'],
  disabledText: transparentize(0.5, COLORS.primaryBlack),
  dropdownOptionText: UI_KIT_COLORS['grey-50'],
  filledInputBg: UI_KIT_COLORS['grey-100'],
  footerLinkHovered: COLORS.primaryBlack,
  footerText: UI_KIT_COLORS['grey-50'],
  getTheAppIllustrationBg: COLORS.primary,
  getTheAppIllustrationButtonColor: COLORS.primaryWhite,
  getTheAppIllustrationTextColor: COLORS.primaryWhite,
  header: COLORS.primaryBlack,
  hint: UI_KIT_COLORS['grey-50'],
  icon: COLORS.primaryWhite,
  iconBg: COLORS.primary,
  iconError: darken(0.02, COLORS.primaryError),
  identityVerificationFailedTimer: COLORS.primaryError,
  illustrationBg: UI_KIT_COLORS['grey-100'],
  incidentBannerCloseIcon: UI_KIT_COLORS['grey-80'],
  incidentBannerIconBackground: UI_KIT_COLORS['grey-100'],
  inputBig: COLORS.primaryBlack,
  inputMessage: UI_KIT_COLORS['grey-80'],
  languagePickerLabelDark: COLORS.primaryBlack,
  languagePickerLabelLight: UI_KIT_COLORS['grey-50'],
  loadingDots: UI_KIT_COLORS['grey-80'],
  layoutBackground: UI_KIT_COLORS['grey-100'],
  menuItemColor: UI_KIT_COLORS['grey-50'],
  menuItemActiveIconColor: COLORS.primary,
  mobileBannerBorder: UI_KIT_COLORS['grey-80'],
  modalBg: COLORS.primaryWhite,
  moneyInputCaret: COLORS.primary,
  moneyInputPlaceholder: UI_KIT_COLORS['grey-90'],
  overlay: COLORS.overlay,
  pageLayoutBg: UI_KIT_COLORS['grey-100'],
  pendingCardPaymentActionIconBg: UI_KIT_COLORS['grey-100'],
  pendingCardPaymentActionLogo: COLORS.primaryBlack,
  rewardsText: UI_KIT_COLORS['grey-50'],
  rewardItemMerchantName: COLORS.primaryBlack,
  rewardsBackButton: COLORS.primaryBlack,
  rewardLikeIconBaground: UI_KIT_COLORS['grey-80'],
  rewardLikeIconColor: COLORS.primaryWhite,
  rewardTilesListSecondaryBackground: COLORS.primaryWhite,
  likesTitle: COLORS.primaryWhite,
  secondaryTextColor: UI_KIT_COLORS['grey-50'],
  selectIconColor: UI_KIT_COLORS['grey-50'],
  sidebarDropdownItemColor: UI_KIT_COLORS['grey-80'],
  textHovered: COLORS.primaryBlack,
  textInactive: UI_KIT_COLORS['grey-50'],
  trademark: UI_KIT_COLORS['grey-80'],
  transactionDetailPropName: UI_KIT_COLORS['grey-50'],
  transactionDetailTitle: UI_KIT_COLORS['grey-35'],
  userDetailsEditableFieldIcon: COLORS.primary,
  userDetailsWarningIcon: COLORS.primaryError,
  userDropdownLogOutButton: UI_KIT_COLORS.accent,
  userDropdownSettingsIcon: UI_KIT_COLORS['grey-80'],
}

export const FONTS = {
  primary: BasierCircle,
}

export const FONT_SIZES = {
  default: rem(17),
  rewardsDefault: rem(16),
  header: rem(35),
  headerMobile: rem(29),
  inputBig: rem(29),
  inputBigMobile: rem(26),
  note: rem(12),
  smaller: rem(15),
  cookiesBanner: rem(13.6),
}

export const FONT_WEIGHTS = {
  default: 400,
  bolder: 500,
  bold: 600,
}

/**
 * Please use "*px" values directly.
 *
 * @deprecated
 */
export const SPACES = {
  px2: '2px',
  px4: '4px',
  px6: '6px',
  px8: '8px',
  px10: '10px',
  px12: '12px',
  px14: '14px',
  px16: '16px',
  px18: '18px',
  px20: '20px',
  px24: '24px',
  px26: '26px',
  px28: '28px',
  px32: '32px',
  px36: '36px',
  px40: '40px',
  px42: '42px',
  px48: '48px',
  px52: '52px',
  px56: '56px',
  px60: '60px',
  px64: '64px',
  px68: '68px',
  px80: '80px',
  px84: '84px',
  px88: '88px',
  px90: '90px',
  px96: '96px',
  px100: '100px',
  px112: '112px',
  px114: '114px',
  px120: '120px',
  px128: '128px',
  px156: '156px',
  px180: '180px',
  px220: '220px',
  px248: '248px',
  px260: '260px',
  px376: '376px',
  authLayoutInnerSpace: '15vw',
}

const SIZES = {
  components: {
    ActionButton: {
      width: 'px152',
    },
    AuthLayout: {
      Illustration: {
        size: '440px',
      },
      LayoutContainer: {
        maxWidth: '576px',
      },
      elements: {
        maxWidth: '376px',
      },
    },
    CloseButton: {
      size: '56px',
      tabletMax: {
        size: '24px',
      },
    },
    CardSelect: {
      icon: {
        size: '56px',
      },
    },
    CookiesBanner: {
      Outer: {
        minHeight: '72px',
      },
      Inner: {
        maxWidth: '1280px',
      },
    },
    CountryCodeSelect: {
      width: '136px',
    },
    DigitInput: {
      width: '56px',
      height: '64px',
      tabletMax: {
        width: '48px',
        height: '56px',
      },
      input: {
        width: '6px',
      },
      separator: {
        width: '24px',
        tabletMax: {
          width: '19px',
        },
      },
    },
    Dots: {
      size: '16px',
    },
    GoogleMapsPointer: {
      height: '160px',
    },
    Hint: {
      maxWidth: '360px',
    },
    IncidentBannerIconBackground: {
      size: '56px',
    },
    LanguageSelector: {
      dropdown: {
        width: '300px',
      },
    },
    MerchantLogo: {
      size: '56px',
    },
    Rewards: {
      LikeBox: {
        height: '20px',
      },
      RewardItem: {
        width: '74px',
      },
      RewardFeedbackOptions: {
        desktopWidth: '536px',
        CustomFeedbackScreen: {
          formHeigth: '67vh',
          buttonWidth: '343px',
        },
      },
      GoToRewardButton: {
        width: '343px',
        bottomStick: '24px',
      },
    },
    PageLayout: {
      maxWidth: '960px',
    },
    PageSectionContent: {
      maxWidth: {
        md: '536px',
      },
    },
    ProgressBar: {
      height: '3px',
    },
    RadioElement: {
      height: '40px',
    },
    MobileAppBanner: {
      height: '80px',
    },
    Sidebar: {
      width: '256px',
      UserMenu: {
        minHeight: '48px',
      },
    },
    TransactionsList: {
      TransactionCard: {
        statusText: {
          mobile: {
            maxWidth: '130px',
          },
          desktop: {
            maxWidth: '500px',
          },
        },
      },
    },
    TopUp: {
      TopUpViaApplePayScreen: {
        maxWidth: '376px',
      },
      TopUpViaGooglePayScreen: {
        maxWidth: '376px',
      },
      TopUpViaCardScreen: {
        maxWidth: '376px',

        iFrame: {
          height: '400px',
        },
      },
      CardCvvFormField: {
        maxWidth: {
          _: '119px',
          md: '136px',
        },
      },
    },
  },
  modals: {
    BaseModal: {
      size: '456px',
      tabletMax: {
        size: '344px',
      },
    },
  },
  pages: {
    Cards: {
      maxWidth: '536px',

      CardPlaceholder: {
        CardSkeletonTop: {
          height: {
            md: '8px',
          },
        },
        CardSkeletonBottom: {
          height: {
            md: '6px',
          },
        },
      },
      CardBase: {
        width: '296px',
      },
      CardSettingsImage: {
        mobile: {
          width: '71px',
        },
        md: {
          width: '124px',
        },
      },
      CardOrdering: {
        CardTypeSelectionImageContainer: {
          height: {
            '*-sm': '246px',
            sm: '221px',
          },
        },
        CardTypeSelectionImage: {
          maxWidth: '221px',
          width: {
            sm: '221px',
          },
        },
      },
      CardsOverview: {
        CardImage: {
          width: '257px',
        },
      },
    },
    SignIn: {
      AuthenticationMethodScreen: {
        CardSelect: {
          maxWidth: '536px',
        },
      },
    },
    SignUp: {
      HomeAddressScreen: {
        Statutory: {
          maxWidth: {
            md: '376px',
          },
        },
      },
    },
    Start: {
      AuthLayout: {
        minHeight: {
          lg: 'calc(100vh - 80px)',
        },
      },
      Illustration: {
        Container: {
          minWidth: '440px',
          width: '33%',
        },
        CtaButton: {
          height: '40px',
        },
      },
    },
    TransactionDetails: {
      maxWidth: {
        md: '536px',
      },
    },
    RequestScopedToken: {
      TakeSelfieScreen: {
        Heading: {
          width: '312px',
        },
      },
      ConfirmSelfieScreen: {
        SubmitSelfieButton: {
          width: '343px',
        },
      },
      BeforeYouStartScreen: {
        ContinueButton: {
          maxWidth: '343px',
        },
      },
      SelfieHeading: {
        width: '536px',
      },
    },
    Rewards: {
      maxWidth: '536px',
    },
    Travel: {
      maxWidth: '536px',
    },
    Wealth: {
      maxWidth: '536px',
    },
  },
}

export const LINE_HEIGHTS = {
  header: '44px',
  headerMobile: '38px',
  label: '16px',
  smallText: '20px',
  text: '24px',
}

export const RADII = {
  cardImage: '9px',
  cardSettingsImageDesktop: '4px',
  cardSettingsImageMobile: '2px',
  filledInput: '8px',
  roundButton: '21px',
  rewardTile: '12px',
  rewardCategory: '10px',
}

export const Z_INDICES = {
  zero: 0,
  min: 1,
  modalHeader: 2,
  selectDropdown: 2,
  baseModal: 3,
  fullPageLoader: 10,
  verificationMethodScreen: 10,
  chatButton: 1000,
  documentViewer: 1010,
}

export const theme: ThemeProps = merge(FaceliftTheme, {
  breakpoints: BREAKPOINTS,
  colors: {
    ...COLORS,
    ...COLOR_STYLES,
  },
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  fontWeights: FONT_WEIGHTS,
  lineHeights: LINE_HEIGHTS,
  radii: RADII,
  sizes: SIZES,
  space: SPACES,
  zIndices: Z_INDICES,
})
