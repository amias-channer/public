import * as React from 'react';
// @ts-ignore TS2307
import appLogoPath from '../../../../images/app-icons/degiro/degiro.svg';
import { amLogo, appAsPartnerInfo, appAsPartnerInfoLogo, appAsPartnerInfoTitle, appLogo, appLogoLayout, appLogoSeparator, centerContent as centerContentClassName, layout } from './header.css';
const Header = ({ assetManager, centerContent, rightAction }) => (React.createElement("header", { className: layout },
    assetManager ? (React.createElement("div", { className: appLogoLayout },
        React.createElement("img", { className: amLogo, src: assetManager.logoUrl, width: 140, height: 24, alt: assetManager.name }),
        React.createElement("div", { className: appLogoSeparator, "aria-hidden": "true" }),
        React.createElement("div", { className: appAsPartnerInfo },
            React.createElement("span", { className: appAsPartnerInfoTitle }, "powered by"),
            React.createElement("img", { className: appAsPartnerInfoLogo, src: appLogoPath, alt: "Home" })))) : (React.createElement("div", { className: appLogoLayout },
        React.createElement("img", { className: appLogo, src: appLogoPath, width: 140, height: 24, alt: "Home" }))),
    React.createElement("div", { className: centerContentClassName }, centerContent),
    rightAction));
export default React.memo(Header);
//# sourceMappingURL=index.js.map