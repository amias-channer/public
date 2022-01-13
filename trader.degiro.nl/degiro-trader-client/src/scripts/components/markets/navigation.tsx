import localize from 'frontend-core/dist/services/i18n/localize';
import {Location} from 'history';
import * as React from 'react';
import {Routes} from '../../navigation';
import isMarketsRootLinkActive from '../../services/router/is-markets-root-link-active';
import {I18nContext} from '../app-component/app-context';
import SubNavigation, {SubNavigationProps} from '../navigation/sub-navigation/index';
import SubNavigationLink from '../navigation/sub-navigation/sub-navigation-link';

type Props = Pick<SubNavigationProps, 'compact'>;

const {useContext} = React;
const isMarketsLinkActive = (_: unknown, location: Location) => isMarketsRootLinkActive(location);
const MarketsNavigation: React.FunctionComponent<Props> = ({compact}) => {
    const i18n = useContext(I18nContext);

    return (
        <SubNavigation compact={compact}>
            <SubNavigationLink to={Routes.MARKETS} isActive={isMarketsLinkActive}>
                {localize(i18n, 'trader.navigation.markets')}
            </SubNavigationLink>
            <SubNavigationLink to={Routes.MARKETS_NEWS}>
                {localize(i18n, 'trader.navigation.markets.news')}
            </SubNavigationLink>
            <SubNavigationLink to={Routes.MARKETS_AGENDA}>
                {localize(i18n, 'trader.navigation.markets.agenda')}
            </SubNavigationLink>
        </SubNavigation>
    );
};

export default React.memo(MarketsNavigation);
