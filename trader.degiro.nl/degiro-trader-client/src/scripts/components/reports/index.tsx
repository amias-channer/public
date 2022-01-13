import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import localize from 'frontend-core/dist/services/i18n/localize';
import hasFlatexBankAccount from 'frontend-core/dist/services/user/has-flatex-bank-account';
import * as React from 'react';
import {mediumViewportMinWidth} from '../../media-queries';
import {CurrentClientContext, I18nContext} from '../app-component/app-context';
import FlatexReportDocuments from './flatex-report-documents';
import ReportDocuments from './report-documents';
import {content} from './reports.css';

const {useContext} = React;
const Reports: React.FunctionComponent = () => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const hasCompactView: boolean = !useMediaQuery(mediumViewportMinWidth);

    useDocumentTitle(localize(i18n, 'trader.navigation.reports'));

    return (
        <div className={content} data-name="reports">
            <ReportDocuments compact={hasCompactView} />
            {hasFlatexBankAccount(currentClient) && <FlatexReportDocuments compact={hasCompactView} />}
        </div>
    );
};

export default React.memo(Reports);
