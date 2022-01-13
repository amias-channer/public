import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import openInAppBrowser from 'frontend-core/dist/platform/navigation/open-in-app-browser';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {accentIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {I18nContext} from '../../../../app-component/app-context';
import useDataTableFullLayoutFlag from '../../../../data-table/hooks/use-data-table-full-layout-flag';
import {AgendaEarningItemDialIn} from '../../../../../models/agenda';
import Grid from '../../../../grid';
import DateValue, {defaultDateTimeValueFormat} from '../../../../value/date';
import {
    section,
    password as passwordClassName,
    value,
    gridCell,
    gridHeaderCell,
    sectionHeader,
    separator,
    buttonWrapper
} from './agenda-earnings-cast.css';
import {filledAccentButton, regularSizeButton} from '../../../../button/button.css';
import ExternalHtmlContent from '../../../../external-html-content';

interface Props {
    title: string;
    dialIn?: AgendaEarningItemDialIn;
    url?: string;
    hasInfoPanel?: boolean;
}

const {useContext} = React;
const DialInInfo: React.FunctionComponent<Props> = ({title, dialIn = {}, url, hasInfoPanel = false}) => {
    const i18n = useContext(I18nContext);
    const hasFullView: boolean = useDataTableFullLayoutFlag();
    const {isOpened, toggle} = useToggle();
    const openUrl = (url: string) => {
        if (isWebViewApp()) {
            openInAppBrowser({url, target: '_system'});
        } else {
            // avoid Window references by using noopener (perf, memory)
            window.open(url, '_blank', 'noopener');
        }
    };
    const {password, isAvailable, startDate, endDate, phoneNumber, altPhoneNumber, notes} = dialIn;

    return (
        <div className={section}>
            <Grid container={true}>
                <Grid container={true} size={12}>
                    <Grid size={hasInfoPanel ? 5 : 6}>
                        <div className={gridHeaderCell}>{title}</div>
                    </Grid>
                    <Grid size={hasFullView ? 3 : 5}>
                        {url && password && (
                            <div className={`${passwordClassName} ${gridCell}`}>
                                {`${localize(i18n, 'trader.markets.agenda.password')}: ${password}`}
                            </div>
                        )}
                    </Grid>
                    <Grid size={hasFullView ? 3 : 1}>
                        {url && (
                            <div className={buttonWrapper}>
                                <button
                                    type="button"
                                    className={hasFullView ? `${filledAccentButton} ${regularSizeButton}` : ''}
                                    onClick={openUrl.bind(null, url)}>
                                    {hasFullView ? (
                                        localize(i18n, 'trader.markets.agenda.viewWebcast')
                                    ) : (
                                        <Icon type="play_circle" className={accentIcon} />
                                    )}
                                </button>
                            </div>
                        )}
                    </Grid>
                    {hasInfoPanel && (
                        <Grid size={1}>
                            {isAvailable && (
                                <div className={buttonWrapper}>
                                    <button type="button" onClick={toggle}>
                                        <Icon flipped={isOpened} type="keyboard_arrow_down" />
                                    </button>
                                </div>
                            )}
                        </Grid>
                    )}
                </Grid>
                {isAvailable && isOpened && (
                    <>
                        <Grid container={true} size={12}>
                            <Grid size={5}>{localize(i18n, 'trader.markets.agenda.status')}</Grid>
                            <Grid size={7}>
                                <div className={value}>{localize(i18n, 'trader.markets.agenda.available')}</div>
                            </Grid>
                            <Grid size={5}>{localize(i18n, 'trader.markets.agenda.duration')}</Grid>
                            <Grid size={7}>
                                <div className={value}>
                                    {localize(
                                        i18n,
                                        `trader.markets.agenda.${dialIn?.isEstimated ? 'estimated' : 'actual'}`
                                    )}
                                </div>
                            </Grid>
                            <Grid size={5}>{localize(i18n, 'trader.markets.agenda.startDate')}</Grid>
                            <Grid size={7}>
                                <DateValue
                                    className={value}
                                    id="startDate"
                                    value={startDate}
                                    field="startDate"
                                    format={defaultDateTimeValueFormat}
                                />
                            </Grid>
                            <Grid size={5}>{localize(i18n, 'trader.markets.agenda.endDate')}</Grid>
                            <Grid size={7}>
                                <DateValue
                                    className={value}
                                    id="endDate"
                                    value={endDate}
                                    field="endDate"
                                    format={defaultDateTimeValueFormat}
                                />
                            </Grid>
                            {phoneNumber && (
                                <>
                                    <Grid size={5}>{localize(i18n, 'trader.markets.agenda.phoneNumber')}</Grid>
                                    <Grid size={7}>
                                        <div className={value}>
                                            <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                                        </div>
                                    </Grid>
                                </>
                            )}
                            {altPhoneNumber && (
                                <>
                                    <Grid size={5}>{localize(i18n, 'trader.markets.agenda.altPhoneNumber')}</Grid>
                                    <Grid size={7}>
                                        <div className={value}>
                                            <a href={`tel:${altPhoneNumber}`}>{altPhoneNumber}</a>
                                        </div>
                                    </Grid>
                                </>
                            )}
                            {!url && password && (
                                <>
                                    <Grid size={5}>{localize(i18n, 'trader.markets.agenda.password')}</Grid>
                                    <Grid size={7}>
                                        <div className={value}>{password}</div>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        {notes && (
                            <>
                                <Grid size={12}>
                                    <div className={separator} />
                                </Grid>
                                <Grid size={12}>
                                    <div className={sectionHeader}>{localize(i18n, 'trader.markets.agenda.notes')}</div>
                                    <ExternalHtmlContent>{notes}</ExternalHtmlContent>
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </Grid>
        </div>
    );
};

export default React.memo(DialInInfo);
