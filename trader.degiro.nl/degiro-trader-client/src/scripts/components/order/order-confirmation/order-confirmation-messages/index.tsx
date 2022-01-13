import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {OrderConfirmation, OrderExperienceCheck} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';
import confirmExperienceCheck from 'frontend-core/dist/services/order/confirm-experience-check';
import * as React from 'react';
import {Statuses} from '../../../../models/status';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import Button, {ButtonVariants} from '../../../button';
import ExternalHtmlContent from '../../../external-html-content';
import StatusIcon from '../../../status/status-icon';
import {
    message,
    messageAction,
    messageContent,
    messageIcon as messageIconClassName
} from './order-confirmation-messages.css';

interface Props {
    orderConfirmation: OrderConfirmation;
}

const {useState, useContext} = React;
const OrderConfirmationMessages: React.FunctionComponent<Props> = ({orderConfirmation}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {messages = [], experienceChecks = []} = orderConfirmation;
    const [confirmedExperienceCheckIds, setConfirmedExperienceCheckIds] = useState<OrderExperienceCheck['id'][]>([]);
    const onExperienceCheckConfirm = (experienceCheck: OrderExperienceCheck) => {
        setConfirmedExperienceCheckIds((ids) => [...ids, experienceCheck.id]);
        confirmExperienceCheck(config, experienceCheck).catch(logErrorLocally);
    };
    const messageIcon: React.ReactNode = <StatusIcon status={Statuses.WARNING} className={messageIconClassName} />;

    return (
        <div data-name="orderConfirmationMessages">
            {messages.map((text: string) => (
                <div key={text} data-name="orderConfirmationMessage" className={message}>
                    {messageIcon}
                    <ExternalHtmlContent className={messageContent}>{localize(i18n, text)}</ExternalHtmlContent>
                </div>
            ))}
            {experienceChecks.map((experienceCheck: OrderExperienceCheck) => {
                const {id: experienceCheckId, confirmText} = experienceCheck;

                return confirmedExperienceCheckIds.includes(experienceCheckId) ? null : (
                    <div
                        key={experienceCheckId}
                        data-id={experienceCheckId}
                        data-name="experienceCheck"
                        className={message}>
                        {messageIcon}
                        <span className={messageContent}>{localize(i18n, experienceCheck.message)}</span>
                        {confirmText && (
                            <Button
                                variant={ButtonVariants.OUTLINED}
                                data-name="experienceCheckConfirmButton"
                                data-id={experienceCheckId}
                                className={messageAction}
                                onClick={onExperienceCheckConfirm.bind(null, experienceCheck)}>
                                {localize(i18n, confirmText)}
                            </Button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(OrderConfirmationMessages);
