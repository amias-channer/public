import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {secondaryActionIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {ButtonSizes, ButtonVariants, getButtonClassName} from '../button';

interface Props {
    url: string;
    compact: boolean;
}

const {useContext} = React;
const downloadButtonClassName: string = getButtonClassName({
    size: ButtonSizes.SMALL,
    variant: ButtonVariants.ACCENT
});
const DownloadButton: React.FunctionComponent<Props> = ({url, compact}) => {
    const i18n = useContext(I18nContext);
    const label: string = localize(i18n, 'trader.reports.downloadAction');

    return compact ? (
        <NewTabLink href={url} aria-label={label}>
            <Icon className={secondaryActionIcon} type="get_app" />
        </NewTabLink>
    ) : (
        <NewTabLink className={downloadButtonClassName} href={url}>
            {label}
        </NewTabLink>
    );
};

export default React.memo(DownloadButton);
