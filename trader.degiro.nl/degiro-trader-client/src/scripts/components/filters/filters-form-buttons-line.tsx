import {buttonsLine, formButton} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Button, {ButtonVariants} from '../button';

const {useContext} = React;
const FiltersFormButtonsLine: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);

    return (
        <div className={buttonsLine}>
            <Button type="submit" variant={ButtonVariants.ACCENT} className={formButton}>
                {localize(i18n, 'trader.filters.showResults')}
            </Button>
        </div>
    );
};

export default React.memo(FiltersFormButtonsLine);
