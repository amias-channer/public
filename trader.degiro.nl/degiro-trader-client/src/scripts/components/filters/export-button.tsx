import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, I18nContext} from '../app-component/app-context';
import Button from '../button';
import ReportExportForm, {ReportExportFormProps} from '../report-export-form/index';
import {collapsedFiltersSectionButton} from './filters.css';

interface ExportButtonProps extends ReportExportFormProps {
    collapsed?: boolean;
}

const {useContext} = React;
const ExportButton: React.FunctionComponent<ExportButtonProps> = ({collapsed, ...exportFormProps}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    // [TRADER-1097] useCallback() adds more complexity then solves caching problems, so we do not use it here
    const openExportWindow = () => {
        app.openModal({
            title: localize(i18n, 'trader.productsTable.exportAction'),
            content: <ReportExportForm {...exportFormProps} />
        });
    };

    return (
        <Button
            data-name="exportButton"
            icon="get_app"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={openExportWindow}
            className={collapsed ? collapsedFiltersSectionButton : undefined}>
            {collapsed ? undefined : localize(i18n, 'trader.productsTable.exportAction')}
        </Button>
    );
};

export default React.memo(ExportButton);
