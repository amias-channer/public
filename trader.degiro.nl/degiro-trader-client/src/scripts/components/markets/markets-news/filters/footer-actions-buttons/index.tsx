import {MultiSelectApi} from 'frontend-core/dist/components/ui-trader4/select/multiple';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../../../app-component/app-context';
import Button, {ButtonSizes, ButtonVariants} from '../../../../button';
import {footerButtons, footerSelectButton} from './footer-actions-buttons.css';

const {useContext} = React;
const FooterActionsButtons: React.FunctionComponent<MultiSelectApi> = ({
    deselectAll,
    selectAll,
    apply,
    hasSelectedValues
}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={footerButtons}>
            {hasSelectedValues ? (
                <button onClick={deselectAll} type="button" className={footerSelectButton}>
                    {localize(i18n, 'trader.filtersList.deselectAllAction')}
                </button>
            ) : (
                <button onClick={selectAll} type="button" className={footerSelectButton}>
                    {localize(i18n, 'trader.filtersList.selectAllAction')}
                </button>
            )}
            <Button size={ButtonSizes.SMALL} type="button" variant={ButtonVariants.ACCENT} onClick={apply}>
                {localize(i18n, 'trader.filtersList.applyAction')}
            </Button>
        </div>
    );
};

export default React.memo(FooterActionsButtons);
