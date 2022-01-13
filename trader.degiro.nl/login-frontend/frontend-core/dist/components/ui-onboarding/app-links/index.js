import * as React from 'react';
import isWebViewApp from '../../../platform/is-web-view-app';
import getAppStoreLink from '../../../services/app-info/get-app-store-link';
import getGooglePlayLink from '../../../services/app-info/get-google-play-link';
import localize from '../../../services/i18n/localize';
import NewTabLink from '../../ui-common/new-tab-link/index';
import { appLinkImg, appLinks, appLink, layout } from './app-links.css';
// @ts-ignore TS2307
import appleStoreImgPath from './images/apple-store-badge.png';
// @ts-ignore TS2307
import googlePlayImgPath from './images/google-play-badge.png';
const AppLinks = ({ i18n, className = '' }) => {
    if (isWebViewApp()) {
        return null;
    }
    return (React.createElement("div", { className: `${layout} ${className}` },
        React.createElement("div", null, localize(i18n, 'registration.apps.downloadAction')),
        React.createElement("div", { className: appLinks },
            React.createElement(NewTabLink, { className: appLink, href: getAppStoreLink(i18n) },
                React.createElement("img", { src: appleStoreImgPath, width: 130, height: 44, className: appLinkImg, loading: "lazy", alt: "App Store" })),
            React.createElement(NewTabLink, { className: appLink, href: getGooglePlayLink(i18n) },
                React.createElement("img", { src: googlePlayImgPath, width: 148, height: 44, className: appLinkImg, loading: "lazy", alt: "Google Play" })))));
};
export default React.memo(AppLinks);
//# sourceMappingURL=index.js.map