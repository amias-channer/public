import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import {I18n} from 'frontend-core/dist/models/i18n';
import isIOS from 'frontend-core/dist/platform/is-ios';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import onExternalLinkClick from 'frontend-core/dist/platform/navigation/on-external-link-click';
import getAppStoreLink from 'frontend-core/dist/services/app-info/get-app-store-link';
import getGooglePlayLink from 'frontend-core/dist/services/app-info/get-google-play-link';
import getTrustPilotLink from 'frontend-core/dist/services/app-info/get-trustpilot-link';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppComponentApi} from '../../app-component';
import {ButtonVariants, getButtonClassName} from '../../button';
import {buttons} from '../../modal/modal.css';

const externalReviewLinkClassName: string = getButtonClassName({
    variant: ButtonVariants.ACCENT
});

export default function openPositiveFeedbackResultModal(app: AppComponentApi, i18n: I18n) {
    const isApp: boolean = isWebViewApp();
    const onNewTabLinkClick = (event: React.MouseEvent<Element>) => {
        onExternalLinkClick(event);
        app.closeModal();
    };
    let content: string;
    let externalReviewLinkHref: string;
    let externalReviewLinkContent: string;

    if (isApp && isIOS()) {
        content = 'trader.feedback.positiveFeedbackMessage.appleStore';
        externalReviewLinkContent = 'trader.feedback.appleStoreRateTitle';
        externalReviewLinkHref = getAppStoreLink(i18n);
    } else if (isApp) {
        content = 'trader.feedback.positiveFeedbackMessage.googlePlayStore';
        externalReviewLinkContent = 'trader.feedback.googlePlayStoreRateTitle';
        externalReviewLinkHref = getGooglePlayLink(i18n);
    } else {
        content = 'trader.feedback.positiveFeedbackMessage.trustpilot';
        externalReviewLinkContent = 'trader.feedback.trustPilotRateTitle';
        externalReviewLinkHref = getTrustPilotLink(i18n);
    }

    app.openModal({
        title: localize(i18n, 'trader.feedback.positiveFeedbackTitle'),
        content: localize(i18n, content),
        footer: (
            <div className={buttons}>
                <NewTabLink
                    className={externalReviewLinkClassName}
                    /* eslint-disable-next-line react/jsx-no-bind */
                    onClick={onNewTabLinkClick}
                    href={externalReviewLinkHref}>
                    {localize(i18n, externalReviewLinkContent)}
                </NewTabLink>
            </div>
        )
    });
}
