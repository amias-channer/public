import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isInboxLinkActive from '../../../services/router/is-inbox-link-active';
import {I18nContext} from '../../app-component/app-context';
import InboxStatusIcon from '../../inbox/inbox-status-icon/index';
import NavigationItemWithTooltip from './navigation-item-with-tooltip';
import {activeNavigationItem, navigationItem, navigationItemIcon} from './side-navigation.css';

const {useCallback, useContext, useMemo} = React;
const InboxNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const isActive: boolean = useMemo(() => isInboxLinkActive(location), [location]);
    const renderTooltip = useCallback(() => localize(i18n, 'trader.navigation.inbox'), [i18n]);

    return (
        <NavigationItemWithTooltip renderTooltip={renderTooltip}>
            <Link
                to={Routes.INBOX}
                aria-label={localize(i18n, 'trader.navigation.inbox')}
                className={`${navigationItem} ${isActive ? activeNavigationItem : ''}`}>
                <InboxStatusIcon iconType={isActive ? 'mail' : 'mail_outline'} iconClassName={navigationItemIcon} />
            </Link>
        </NavigationItemWithTooltip>
    );
};

export default React.memo(InboxNavigationItem);
