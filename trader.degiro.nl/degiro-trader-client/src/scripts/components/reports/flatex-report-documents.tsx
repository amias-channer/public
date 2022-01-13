import useAsync from 'frontend-core/dist/hooks/use-async';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {FlatexDocument} from 'frontend-core/dist/models/flatex-document';
import getFlatexDocumentUrl from 'frontend-core/dist/services/document/get-flatex-document-url';
import getFlatexReportDocuments from 'frontend-core/dist/services/document/get-flatex-report-documents';
import localize from 'frontend-core/dist/services/i18n/localize';
import {DateParserOptions} from 'frontend-core/dist/utils/date/parse-date';
import * as React from 'react';
import {AppApiContext, ConfigContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import {item, list, primaryContent, secondaryContent, underlinedItem} from '../list/list.css';
import NoProductsMessage from '../no-products-message';
import Spinner from '../progress-bar/spinner';
import {noTableDataMessage} from '../table/table.css';
import DateValue from '../value/date';
import DownloadButton from './download-button';
import {itemDate, itemTitle} from './reports.css';

interface Props {
    compact: boolean;
}

const {useEffect, useContext} = React;
const dateValueParserOptions: DateParserOptions = {keepOriginDate: true};
const FlatexReportDocuments: React.FunctionComponent<Props> = ({compact}) => {
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const i18nKeyPrefix: string = 'trader.reports.flatexReports';
    const cardTitle: string = localize(i18n, `${i18nKeyPrefix}.title`);
    const {isLoading, value: reportDocuments = [], error} = useAsync<FlatexDocument[]>(
        () => getFlatexReportDocuments(config),
        [config]
    );
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
                    {reportDocuments.map((document: FlatexDocument) => {
                        const {documentId} = document;
                        const documentUrl: string = getFlatexDocumentUrl(config, documentId);

                        return (
                            <li
                                key={String(documentId)}
                                data-name="flatex-report"
                                data-id={documentId}
                                className={`${item} ${underlinedItem}`}>
                                <div className={primaryContent}>
                                    <DateValue
                                        className={itemDate}
                                        id={document.documentId}
                                        format="YYYY-MM-DD"
                                        value={document.date}
                                        parserOptions={dateValueParserOptions}
                                        field="date"
                                    />
                                    <span data-field="type" className={itemTitle}>
                                        {localize(i18n, `${i18nKeyPrefix}.category.${document.type}`)}
                                    </span>
                                </div>
                                <div className={secondaryContent}>
                                    <DownloadButton url={documentUrl} compact={compact} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <NoProductsMessage className={noTableDataMessage} />
            )}
        </Card>
    );
};

export default React.memo(FlatexReportDocuments);
