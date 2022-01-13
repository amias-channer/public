import * as React from 'react';
import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import {accentIcon, disabledIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import {AppApiContext, I18nContext} from '../../../../app-component/app-context';
import useDataTableFullLayoutFlag from '../../../../data-table/hooks/use-data-table-full-layout-flag';
import {ModalSizes} from '../../../../modal';
import {AgendaEarningItem} from '../../../../../models/agenda';
import PopupContent from './popup-content';
import CountryFlag from '../../../../country-flag';
import {countryFlag} from '../../agenda.css';
import {sidePanelLayout, sidePanelHeader} from './agenda-earnings-cast.css';
import {actionLink} from '../../../../../../styles/link.css';

interface Props {
    item: AgendaEarningItem;
    isFakeLink?: boolean;
}

const {useContext, useMemo} = React;
const AgendaEarningsCast: React.FunctionComponent<Props> = ({item, isFakeLink}) => {
    const hasFullView: boolean = useDataTableFullLayoutFlag();
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const showItemInfo = () => {
        const title = (
            <span>
                <CountryFlag country={item.countryCode} className={`${inlineLeft} ${countryFlag}`} />
                {item.organizationName}
            </span>
        );

        if (hasFullView) {
            app.openModal({size: ModalSizes.MEDIUM, title, content: <PopupContent item={item} />, footer: null});
        } else {
            app.openSideInformationPanel({
                content: (
                    <div className={sidePanelLayout}>
                        <header className={sidePanelHeader}>{title}</header>
                        <PopupContent item={item} />
                    </div>
                )
            });
        }
    };
    const {
        liveWebcastUrl,
        replayWebcastUrl,
        liveDialIn: {isAvailable: liveDialInIsAvailable} = {},
        replayDialIn: {isAvailable: replayDialInIsAvailable} = {}
    } = item;
    const activeCast: React.ReactNode = useMemo(() => {
        return isFakeLink ? (
            <span className={actionLink}>{localize(i18n, 'trader.markets.agenda.cast')}</span>
        ) : (
            <Icon type="play_circle" className={accentIcon} />
        );
    }, [isFakeLink, i18n]);
    const inactiveCast: React.ReactNode = useMemo(() => {
        return isFakeLink ? (
            <span className={actionLink}>{localize(i18n, 'trader.markets.agenda.more')}</span>
        ) : (
            <Icon type="info_outline" />
        );
    }, [isFakeLink, i18n]);

    if (
        !liveWebcastUrl &&
        !replayWebcastUrl &&
        !item.summary &&
        !item.notes &&
        !liveDialInIsAvailable &&
        !replayDialInIsAvailable &&
        !isFakeLink
    ) {
        return <Icon type="play_circle" className={disabledIcon} />;
    }

    return (
        <button type="button" onClick={showItemInfo}>
            {!liveWebcastUrl && !replayWebcastUrl && !liveDialInIsAvailable && !replayDialInIsAvailable
                ? inactiveCast
                : activeCast}
        </button>
    );
};

export default React.memo(AgendaEarningsCast);
