import useAsync from 'frontend-core/dist/hooks/use-async';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {Document} from 'frontend-core/dist/models/document';
import getDocumentUrl from 'frontend-core/dist/services/document/get-document-url';
import getReportDocuments from 'frontend-core/dist/services/document/get-report-documents';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, ConfigContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import {item, list, primaryContent, secondaryContent, underlinedItem} from '../list/list.css';
import NoProductsMessage from '../no-products-message';
import Spinner from '../progress-bar/spinner';
import {noTableDataMessage} from '../table/table.css';
import DownloadButton from './download-button';
import {itemTitle} from './reports.css';

interface Props {
    compact: boolean;
}

const {useEffect, useContext} = React;
const ReportDocuments: React.FunctionComponent<Props> = ({compact}) => {
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const cardTitle: string = localize(i18n, 'trader.navigation.reports');
    const {isLoading, value: reportDocuments = [], error} = useAsync<Document[]>(() => getReportDocuments(config), [
        config
    ]);
    const hasDocuments: boolean = reportDocuments.length > 0;

    useEffect(() => {
        if (error) {
            logErrorLocally(error);
            app.openModal({error});
        }
    }, [error]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Card innerHorizontalGap={!hasDocuments} header={<CardHeader title={cardTitle} />} footer={true}>
            {hasDocuments ? (
                <ul className={list}>
                    {reportDocuments.map(({id: documentId, description}: Document) => (
                        <li
                            key={String(documentId)}
                            data-name="report"
                            data-id={documentId}
                            className={`${item} ${underlinedItem}`}>
                            <div className={primaryContent}>
                                <span data-field="description" className={itemTitle}>
                                    {description}
                                </span>
                            </div>
                            <div className={secondaryContent}>
                                <DownloadButton url={getDocumentUrl(config, documentId)} compact={compact} />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <NoProductsMessage className={noTableDataMessage} />
            )}
        </Card>
    );
};

export default React.memo(ReportDocuments);
