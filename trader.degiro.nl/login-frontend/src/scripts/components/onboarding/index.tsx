import Carousel, {Slide} from 'frontend-core/dist/components/ui-onboarding/carousel';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import slide1ImgUrl from '../../../images/svg/onboarding-slide1.svg';
import slide2ImgUrl from '../../../images/svg/onboarding-slide2.svg';
import slide3ImgUrl from '../../../images/svg/onboarding-slide3.svg';
import slide4ImgUrl from '../../../images/svg/onboarding-slide4.svg';
import slide5ImgUrl from '../../../images/svg/onboarding-slide5.svg';
import {I18nContext} from '../app-component/app-context';
import {button as buttonClassName, buttonsContainer, layout} from './onboarding.css';

interface Props {
    onRegistrationStart(): void;
    onLoginStart(): void;
}

const {useMemo, useContext} = React;
const Onboarding: React.FunctionComponent<Props> = ({onRegistrationStart, onLoginStart}) => {
    const i18n = useContext(I18nContext);
    const slides = useMemo<Slide[]>(
        () => [
            {
                title: localize(i18n, 'login.onboarding.features.registration.title'),
                description: localize(i18n, 'login.onboarding.features.registration.description'),
                imgUrl: slide1ImgUrl
            },
            {
                title: localize(i18n, 'login.onboarding.features.lowFees.title'),
                description: localize(i18n, 'login.onboarding.features.lowFees.description'),
                imgUrl: slide2ImgUrl
            },
            {
                title: localize(i18n, 'login.onboarding.features.trustedService.title'),
                description: localize(i18n, 'login.onboarding.features.trustedService.description'),
                imgUrl: slide3ImgUrl
            },
            {
                title: localize(i18n, 'login.onboarding.features.safety.title'),
                description: localize(i18n, 'login.onboarding.features.safety.description'),
                imgUrl: slide4ImgUrl
            },
            {
                title: localize(i18n, 'login.onboarding.features.opportunities.title'),
                description: localize(i18n, 'login.onboarding.features.opportunities.description'),
                imgUrl: slide5ImgUrl
            }
        ],
        [i18n]
    );

    return (
        <div data-name="onboarding" className={layout}>
            <Carousel slides={slides} />
            <div className={buttonsContainer}>
                <Button className={buttonClassName} data-name="registrationButton" onClick={onRegistrationStart}>
                    {localize(i18n, 'login.loginForm.createNewAccount')}
                </Button>
                <Button className={buttonClassName} data-name="loginButton" onClick={onLoginStart}>
                    {localize(i18n, 'login.loginForm.loginAction')}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(Onboarding);
