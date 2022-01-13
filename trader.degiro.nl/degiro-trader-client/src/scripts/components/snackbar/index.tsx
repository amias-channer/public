import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {createPortal} from 'react-dom';
import {I18nContext} from '../app-component/app-context';
import {closeButton, snackbar, snackbarsList} from './snackbar.css';

interface Props {
    onClose(): void;
}

const {useState, useLayoutEffect, useCallback, useContext} = React;
const initSnackbarsListElement = (): HTMLElement => {
    const id: string = 'snackbarsList';
    let el: HTMLElement | null = document.getElementById(id);

    if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.className = snackbarsList;
        el.dataset.name = 'portal';
        document.body.appendChild(el);
    }

    return el;
};
const initSnackbarElement = (): HTMLElement => {
    const el: HTMLElement = document.createElement('div');

    el.dataset.name = 'snackbar';
    el.className = snackbar;

    return el;
};
const Snackbar: React.FunctionComponent<Props> = ({children, onClose}) => {
    const i18n = useContext(I18nContext);
    const [listEl] = useState<HTMLElement>(initSnackbarsListElement);
    const [el] = useState<HTMLElement>(initSnackbarElement);
    const autoClose = useCallback(() => onClose(), [onClose]);
    const closeOnClick = () => {
        // prevent firing onClose 2nd time from auto-closing
        el.removeEventListener('animationend', autoClose);
        onClose();
    };

    useLayoutEffect(() => {
        // set auto-closing
        el.addEventListener('animationend', autoClose);

        return () => el.removeEventListener('animationend', autoClose);
    }, [autoClose]);

    useLayoutEffect(() => {
        // add new items to the top of the list
        listEl.prepend(el);

        return () => {
            // remove the whole list container if it's the last snackbar item
            if (listEl.childElementCount < 2) {
                listEl.remove();
            } else {
                el.remove();
            }
        };
    }, []);

    return createPortal(
        <>
            {children}
            <button
                type="button"
                data-name="snackbarCloseButton"
                onClick={closeOnClick}
                className={closeButton}
                aria-label={localize(i18n, 'modals.closeTitle')}>
                <Icon type="close" />
            </button>
        </>,
        el
    );
};

export default React.memo<React.PropsWithChildren<Props>>(Snackbar);
