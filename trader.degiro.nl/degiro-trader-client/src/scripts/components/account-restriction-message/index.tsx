import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../navigation';
import {CurrentClientContext, I18nContext} from '../app-component/app-context';
import {ButtonVariants, getButtonClassName} from '../button';
import {content, footer, layout} from './account-restriction-message.css';

interface Props {
    moduleName?: string;
    className?: string;
    onUpgradeClick?: () => void;
}

const {useContext} = React;
const upgradeButtonClassName: string = getButtonClassName({variant: ButtonVariants.ACCENT});
const AccountRestrictionMessage: React.FunctionComponent<Props> = ({moduleName, className = '', onUpgradeClick}) => {
    const i18n = useContext(I18nContext);
    const {clientRoleTranslation, canUpgrade} = useContext(CurrentClientContext);
    const pageMessage: string = localize(i18n, 'trader.accountRestriction.message', {
        accountType: ((clientRoleTranslation && localize(i18n, clientRoleTranslation)) || '').toUpperCase(),
        moduleName: (moduleName && localize(i18n, moduleName)) || ''
    });

    return (
        <div className={`${layout} ${className}`} role="alert">
            <div className={content}>{pageMessage}</div>
            {canUpgrade && (
                <div className={footer}>
                    <Link className={upgradeButtonClassName} to={Routes.TRADING_PROFILE} onClick={onUpgradeClick}>
                        {localize(i18n, 'trader.accountRestriction.upgradeAction')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default React.memo(AccountRestrictionMessage);
