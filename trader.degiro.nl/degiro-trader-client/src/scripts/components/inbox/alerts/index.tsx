import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {MessageSeverityLevels} from 'frontend-core/dist/models/message';
import {MarginCallStatuses} from 'frontend-core/dist/models/total-portfolio';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import {AlertMessage} from '../../../models/inbox';
import {Routes} from '../../../navigation';
import getMarginCallStatusI18nOptions from '../../account-summary/margin-call-status/get-margin-call-status-i18n-options';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import useAlertMessages from '../hooks/use-alert-messages';
import useInboxSettings from '../hooks/use-inbox-settings';
import Alert from './alert';
import {actionLink, content} from './alerts.css';
import AlertCloseButton from './close-button';
import getAlertStatusTextClassName from './get-alert-status-text-class-name';
import useOpenAvailableCostsInfoModal from '../../app-component/hooks/use-open-available-costs-info-modal';

const {useState, useEffect, useContext} = React;
const Alerts: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {totalPortfolio} = useTotalPortfolio();
    const {settings, markMessagesAsRead} = useInboxSettings();
    const messages: AlertMessage[] = useAlertMessages(settings);
    const [visibleAlert, setVisibleAlert] = useState<AlertMessage | undefined>(undefined);

    useEffect(() => {
        setVisibleAlert(messages.find(({read}: AlertMessage) => !read));
    }, [messages]);

    const {marginCallStatus} = totalPortfolio;
    const isMarginCallOpen: boolean = marginCallStatus === MarginCallStatuses.OPEN;
    const isMarginCallPassedDeadline: boolean = marginCallStatus === MarginCallStatuses.IN_LIQUIDATION;
    const openAvailableCostsInfoModal = useOpenAvailableCostsInfoModal();

    if (isMarginCallOpen || isMarginCallPassedDeadline) {
        const severity: MessageSeverityLevels = isMarginCallOpen
            ? MessageSeverityLevels.MEDIUM
            : MessageSeverityLevels.URGENT;
        const marginCallStatusI18nOptions = getMarginCallStatusI18nOptions(config, currentClient, totalPortfolio);

        return (
            <Alert severity={severity}>
                <InnerHtml className={content}>
                    {localize(
                        i18n,
                        `trader.totalPortfolio.marginCall.status.${marginCallStatus}.title`,
                        marginCallStatusI18nOptions
                    )}
                </InnerHtml>
                <button
                    type="button"
                    onClick={openAvailableCostsInfoModal}
                    className={`${actionLink} ${getAlertStatusTextClassName(severity)}`}>
                    {localize(i18n, 'trader.productsTable.showMore')}
                </button>
            </Alert>
        );
    }

    if (visibleAlert) {
        const {severity} = visibleAlert;

        return (
            <Alert severity={severity} closable={true}>
                <InnerHtml className={content}>{visibleAlert.title}</InnerHtml>
                <Link
                    to={`${Routes.INBOX}/${visibleAlert.id}`}
                    className={`${actionLink} ${getAlertStatusTextClassName(severity)}`}>
                    {localize(i18n, 'trader.productsTable.showMore')}
                </Link>
                <AlertCloseButton onClick={markMessagesAsRead.bind(null, [visibleAlert])} />
            </Alert>
        );
    }

    return null;
};

export default React.memo(Alerts);
