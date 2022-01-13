import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import appLogoPath from '../../../images/svg/dg-logo-dark.svg';
import {I18nContext} from '../app-component/app-context';
import {nbsp} from '../value';
import {contentBlock, header, logo} from './about-app.css';
import DataVendors from './data-vendors';

const {useContext} = React;
const AboutApp: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);

    return (
        <article>
            <h3 className={header}>
                <img alt="DEGIRO" className={logo} src={appLogoPath} /> {localize(i18n, 'trader.aboutApp.version')}
                {nbsp}
                {appVersion}
            </h3>
            <DataVendors className={contentBlock} withLogos={true} />
        </article>
    );
};

export default React.memo(AboutApp);
