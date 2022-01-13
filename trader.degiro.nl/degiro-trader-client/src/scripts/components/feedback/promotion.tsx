import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import writeFeedbackImgUrl from '../../../images/svg/write-feedback.svg';
import {ConfigContext, I18nContext, MainClientContext} from '../app-component/app-context';
import PromotionCloseButton from '../promotion/close-button';
import {
    closablePromotion,
    description,
    image,
    inlinePrimaryContent,
    primaryContent,
    promotion,
    title
} from '../promotion/promotion.css';
import FeedbackButton from './button/index';

interface Props {
    className?: string;
    fullPage?: boolean;
    closable?: boolean;
}

const {useState, useCallback, useContext} = React;
const FeedbackPromotion: React.FunctionComponent<Props> = ({closable = true, className = '', fullPage}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const [isVisible, setIsVisible] = useState<boolean>(
        () => !closable || !getAppSettingsGroup(mainClient).hasClosedFeedbackPromotion
    );
    const close = useCallback(() => {
        setIsVisible(false);
        setAppSettingsGroup(config, mainClient, {hasClosedFeedbackPromotion: true}).catch(logErrorLocally);
    }, [config, mainClient]);

    if (!isVisible) {
        return null;
    }

    return (
        <FeedbackButton
            data-name="feedbackPromotion"
            className={`${promotion} ${closable ? closablePromotion : ''} ${className}`}>
            <span className={fullPage ? inlinePrimaryContent : primaryContent}>
                <span className={title}>{localize(i18n, 'trader.feedback.title')}</span>
                <span className={description}>{localize(i18n, 'trader.feedback.subTitle')}</span>
            </span>
            {/*
                use explicit image size to decrease Cumulative Layout Shift
                https://web.dev/optimize-cls/?utm_source=lighthouse&utm_medium=node#images-without-dimensions
            */}
            <img src={writeFeedbackImgUrl} alt="" width={88} height={56} className={image} />
            {closable && <PromotionCloseButton onClick={close} />}
        </FeedbackButton>
    );
};

export default React.memo(FeedbackPromotion);
