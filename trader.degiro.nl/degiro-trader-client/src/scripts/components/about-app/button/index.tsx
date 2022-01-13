import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import onExternalLinkClick from 'frontend-core/dist/platform/navigation/on-external-link-click';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, I18nContext} from '../../app-component/app-context';
import {ButtonVariants, getButtonClassName} from '../../button';
import {ModalSizes} from '../../modal';
import {buttons} from '../../modal/modal.css';
import AboutApp from '../index';
import {button} from './button.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const {useCallback, useContext} = React;
const confirmButtonClassName = getButtonClassName({variant: ButtonVariants.ACCENT});
const AboutAppButton: React.FunctionComponent<Props> = ({className = '', children, ...buttonProps}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const onLinkClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        onExternalLinkClick(event);
        app.closeModal();
    }, []);
    const openAboutAppModal = useCallback(() => {
        app.openModal({
            size: ModalSizes.SMALL,
            title: localize(i18n, 'trader.aboutApp.title'),
            content: <AboutApp />,
            footer: (
                <div className={buttons}>
                    <NewTabLink
                        onClick={onLinkClick}
                        href={localize(i18n, 'url.degiro.homepage')}
                        className={confirmButtonClassName}>
                        {localize(i18n, 'trader.aboutApp.visitUs')}
                    </NewTabLink>
                </div>
            )
        });
    }, [i18n]);

    return (
        <button
            type="button"
            data-name="aboutAppButton"
            {...buttonProps}
            className={`${button} ${className}`}
            onClick={openAboutAppModal}>
            {children || localize(i18n, 'trader.aboutApp.globalButton.title')}
        </button>
    );
};

export default React.memo(AboutAppButton);
