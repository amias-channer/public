import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {ReportTypes} from '../../models/report';
import getReportUrl from '../../services/report/get-report-url';
import {ConfigContext, CurrentClientContext} from '../app-component/app-context';
import {buttonsGroupItem} from '../buttons-group/buttons-group.css';
import DatePicker from '../datepicker/index';
import DateValue from '../value/date';
import {buttonsGroup, datePickerControl} from './report-export-form.css';

export interface ReportExportFormProps {
    reportBaseUrl: string;
    reportUrlParams?: object;
    fromDate?: Date;
    toDate?: Date;
}

const {useState, useCallback, useContext} = React;
const getTodayDate = (): Date => new Date();
const ReportExportForm: React.FunctionComponent<ReportExportFormProps> = ({
    fromDate,
    reportUrlParams,
    reportBaseUrl,
    toDate: initialToDate = getTodayDate()
}) => {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const [toDate, setToDate] = useState<Date>(initialToDate);
    const [maxEndDate] = useState<Date>(getTodayDate);
    const onDateChange = useCallback((_: string, toDate: Date) => setToDate(toDate), []);
    const getReportUrlByType = (type: ReportTypes) => {
        return getReportUrl(config, currentClient, {
            url: `${reportBaseUrl}${type}`,
            params: {...reportUrlParams, fromDate, toDate}
        });
    };

    return (
        <div data-name="reportExportForm">
            {fromDate ? (
                <div>
                    <DateValue id="reportPeriod" field="fromDate" value={fromDate} />
                    {' – '}
                    <DateValue id="reportPeriod" field="toDate" value={toDate} />
                </div>
            ) : (
                <DatePicker
                    controlClassName={datePickerControl}
                    value={toDate}
                    max={maxEndDate}
                    onChange={onDateChange}
                    name="reportEndDate"
                />
            )}
            <div className={buttonsGroup}>
                <NewTabLink className={buttonsGroupItem} href={getReportUrlByType(ReportTypes.HTML)}>
                    <Icon type="print_outline" />
                </NewTabLink>
                <NewTabLink className={buttonsGroupItem} href={getReportUrlByType(ReportTypes.XLS)}>
                    XLS
                </NewTabLink>
                <NewTabLink className={buttonsGroupItem} href={getReportUrlByType(ReportTypes.CSV)}>
                    CSV
                </NewTabLink>
                <NewTabLink className={buttonsGroupItem} href={getReportUrlByType(ReportTypes.PDF)}>
                    PDF
                </NewTabLink>
            </div>
        </div>
    );
};

export default React.memo(ReportExportForm);
