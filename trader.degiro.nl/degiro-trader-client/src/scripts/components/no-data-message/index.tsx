import {inlineCenterContent} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';

interface Props {
    className?: string;
}

const {useContext} = React;
const NoDataMessage: React.FunctionComponent<React.PropsWithChildren<Props>> = ({className = '', children}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={`${inlineCenterContent} ${className}`}>
            {children || localize(i18n, 'trader.noDataToDisplay')}
        </div>
    );
};

export default React.memo(NoDataMessage);
