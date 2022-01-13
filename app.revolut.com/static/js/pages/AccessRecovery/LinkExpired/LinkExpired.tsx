import { useTranslation } from 'react-i18next'
import { AssetProject, getAsset } from '@revolut/rwa-core-utils'
import { Placeholder, Layout } from '@revolut/ui-kit'

type Props = { onAction: () => void }

export const LinkExpired = ({ onAction }: Props) => {
  const { t } = useTranslation('pages.InvalidateAccessRecovery')

  return (
    <Layout>
      <Layout.Main>
        <Placeholder m="auto">
          <Placeholder.Image
            src={getAsset(
              'business/illustrations-repository/checklist-pencil@2x.png',
              AssetProject.Media,
            )}
          />
          <Placeholder.Title>{t('LinkExpired.title')}</Placeholder.Title>
          <Placeholder.Description>{t('LinkExpired.subtitle')}</Placeholder.Description>
          <Placeholder.Action onClick={onAction}>
            {t('LinkExpired.action')}
          </Placeholder.Action>
        </Placeholder>
      </Layout.Main>
    </Layout>
  )
}
