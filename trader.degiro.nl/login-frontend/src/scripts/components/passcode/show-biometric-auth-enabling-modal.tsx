import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import faceIdImgUrl from '../../../images/svg/face-id.svg';
import touchIdImgUrl from '../../../images/svg/touch-id.svg';
import {AppComponentApi} from '../app-component';
import {biometricAuthModalImages, biometricAuthModalImgWrapper} from './passcode.css';

interface Props {
    i18n: I18n;
    openModal: AppComponentApi['openModal'];
}

export default function showBiometricAuthEnablingModal({i18n, openModal}: Props): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        openModal({
            title: localize(i18n, 'login.biometricAuth.enabling.title'),
            content: (
                <figure>
                    <figcaption>
                        <InnerHtml>{localize(i18n, 'login.biometricAuth.enabling.description')}</InnerHtml>
                    </figcaption>
                    <div className={biometricAuthModalImages}>
                        <div className={biometricAuthModalImgWrapper}>
                            <img width={60} height={60} src={touchIdImgUrl} alt="Touch ID" />
                        </div>
                        <div className={biometricAuthModalImgWrapper}>
                            <img width={40} height={40} src={faceIdImgUrl} alt="Face ID" />
                        </div>
                    </div>
                </figure>
            ),
            actions: [
                {
                    component: 'button',
                    props: {type: 'button', onClick: () => resolve(false)},
                    content: localize(i18n, 'modals.cancelTitle')
                },
                {
                    component: 'button',
                    props: {type: 'button', onClick: () => resolve(true)},
                    content: localize(i18n, 'modals.confirmTitle')
                }
            ]
        });
    });
}
