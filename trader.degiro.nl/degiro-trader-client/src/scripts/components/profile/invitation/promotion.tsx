import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import inviteImgUrl from '../../../../images/svg/invite.svg';
import canInviteFriends from '../../../services/invitation/can-invite-friends';
import {ConfigContext, I18nContext, MainClientContext} from '../../app-component/app-context';
import PromotionCloseButton from '../../promotion/close-button';
import {
    closablePromotion,
    description,
    image,
    inlinePrimaryContent,
    primaryContent,
    promotion,
    title
} from '../../promotion/promotion.css';
import InvitationLink from './link';

interface Props {
    className?: string;
    fullPage?: boolean;
    closable?: boolean;
}

const {useState, useContext} = React;
const InvitationPromotion: React.FunctionComponent<Props> = ({fullPage, closable = true, className = ''}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const [isVisible, setIsVisible] = useState<boolean>(() => {
        return (
            canInviteFriends(mainClient) && (!closable || !getAppSettingsGroup(mainClient).hasClosedInvitationPromotion)
        );
    });
    const close = () => {
        setIsVisible(false);
        setAppSettingsGroup(config, mainClient, {hasClosedInvitationPromotion: true}).catch(logErrorLocally);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <InvitationLink
            data-name="invitationPromotion"
            className={`${promotion} ${closable ? closablePromotion : ''} ${className}`}>
            <span className={fullPage ? inlinePrimaryContent : primaryContent}>
                <span className={title}>{localize(i18n, 'trader.profile.invitation.title')}</span>
                <span className={description}>{localize(i18n, 'trader.profile.invitation.description')}</span>
            </span>
            {/*
                use explicit image size to decrease Cumulative Layout Shift
                https://web.dev/optimize-cls/?utm_source=lighthouse&utm_medium=node#images-without-dimensions
            */}
            <img src={inviteImgUrl} alt="" width={72} height={56} className={image} />
            {/* eslint-disable-next-line react/jsx-no-bind */}
            {closable && <PromotionCloseButton onClick={close} />}
        </InvitationLink>
    );
};

export default React.memo(InvitationPromotion);
