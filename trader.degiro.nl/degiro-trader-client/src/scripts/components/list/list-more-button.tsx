import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {cardFooterActionButton} from '../card-obsolete/card.css';

interface Props {
    className?: string;
    onClick(): void;
}

const {useContext} = React;
const ListMoreButton: React.FunctionComponent<Props> = ({onClick, className = ''}) => {
    const i18n = useContext(I18nContext);

    return (
        <button
            type="button"
            data-name="showMoreButton"
            className={`${cardFooterActionButton} ${className}`}
            onClick={onClick}>
            {localize(i18n, 'trader.productsTable.showMore')}
        </button>
    );
};

export default React.memo(ListMoreButton);
