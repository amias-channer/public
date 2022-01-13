import CoreAppLinks from 'frontend-core/dist/components/ui-onboarding/app-links';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {layout} from './app-links.css';

const {useContext} = React;
const AppLinks: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);

    return <CoreAppLinks i18n={i18n} className={layout} />;
};

export default React.memo(AppLinks);
