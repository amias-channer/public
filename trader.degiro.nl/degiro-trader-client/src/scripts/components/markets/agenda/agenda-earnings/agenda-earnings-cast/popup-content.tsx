import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import {I18nContext} from '../../../../app-component/app-context';
import {AgendaEarningItem} from '../../../../../models/agenda';
import DialInInfo from './dial-in-info';
import {popupLayout, section, sectionHeader, sectionWithTopGap} from './agenda-earnings-cast.css';
import ExternalHtmlContent from '../../../../external-html-content';

interface Props {
    item: AgendaEarningItem;
}

const {useContext} = React;
const PopupContent: React.FunctionComponent<Props> = ({item}) => {
    const i18n = useContext(I18nContext);
    const {eventType, summary, liveWebcastUrl, liveDialIn, replayWebcastUrl, replayDialIn, notes} = item;

    return (
        <div className={popupLayout}>
            <div className={section}>
                <div className={sectionHeader}>{localize(i18n, 'trader.markets.agenda.event')}</div>
                <div>
                    {item.description}
                    {eventType
                        ? ` (${localize(i18n, 'trader.markets.agenda.eventType')} ${localize(
                              i18n,
                              `trader.markets.agenda.eventTypes.${eventType}`
                          )})`
                        : ''}
                </div>
                {notes && (
                    <div className={sectionWithTopGap}>
                        <ExternalHtmlContent>{notes}</ExternalHtmlContent>
                    </div>
                )}
                {summary && (
                    <div className={sectionWithTopGap}>
                        <div className={sectionHeader}>{localize(i18n, 'trader.markets.agenda.summary')}</div>
                        <ExternalHtmlContent>{summary}</ExternalHtmlContent>
                    </div>
                )}
            </div>
            {(liveDialIn?.isAvailable || liveWebcastUrl) && (
                <DialInInfo
                    title={localize(i18n, 'trader.markets.agenda.live')}
                    dialIn={liveDialIn}
                    url={liveWebcastUrl}
                    hasInfoPanel={liveDialIn?.isAvailable || replayDialIn?.isAvailable}
                />
            )}
            {(replayDialIn?.isAvailable || replayWebcastUrl) && (
                <DialInInfo
                    title={localize(i18n, 'trader.markets.agenda.replay')}
                    dialIn={replayDialIn}
                    url={replayWebcastUrl}
                    hasInfoPanel={liveDialIn?.isAvailable || replayDialIn?.isAvailable}
                />
            )}
        </div>
    );
};

export default React.memo(PopupContent);
