import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {FeedbackEvents} from '../../../event-broker/event-types';
import {EventBrokerContext, I18nContext} from '../../app-component/app-context';
import {feedbackButton} from './button.css';

interface Props {
    className?: string;
    ['data-name']?: string;
}

const {useCallback, useContext} = React;
const FeedbackButton: React.FunctionComponent<Props> = ({
    className = '',
    children,
    'data-name': dataName = 'feedbackButton'
}) => {
    const i18n = useContext(I18nContext);
    const eventBroker = useContext(EventBrokerContext);
    const onClick = useCallback(() => eventBroker.emit(FeedbackEvents.OPEN), []);

    return (
        <button type="button" data-name={dataName} className={`${feedbackButton} ${className}`} onClick={onClick}>
            {children || localize(i18n, 'trader.feedback.globalButton.title')}
        </button>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(FeedbackButton);
