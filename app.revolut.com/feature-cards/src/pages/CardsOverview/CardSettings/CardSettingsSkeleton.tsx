import { Header, HeaderSkeleton } from '@revolut/ui-kit'

export const CARD_SETTINGS_SKELETON_TITLE_TEST_ID = 'card-settings-skeleton-title'

export const CardSettingsSkeleton = () => (
  <Header variant="item">
    <Header.CloseButton aria-label="Close" />
    <HeaderSkeleton.Title data-testid={CARD_SETTINGS_SKELETON_TITLE_TEST_ID} />
  </Header>
)
