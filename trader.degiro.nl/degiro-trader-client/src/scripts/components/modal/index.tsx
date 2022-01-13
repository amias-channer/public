import generateElementId from 'frontend-core/dist/components/ui-common/component/generate-element-id';
import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import Portal from 'frontend-core/dist/components/ui-common/portal';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {AppError} from 'frontend-core/dist/models/app-error';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {I18nContext} from '../app-component/app-context';
import Button, {ButtonSizes, ButtonVariants} from '../button';
import {largeSizeButton, selectableButtonWithBackdrop} from '../button/button.css';
import ExternalHtmlContent from '../external-html-content/index';
import {
    backdrop,
    buttons,
    cancelButton,
    confirmButton,
    content,
    header as headerClassName,
    headerTitle,
    largeWindow,
    mediumWindow,
    smallWindow,
    textOnlyContent,
    modalWindow,
    largeHeightWindow,
    mediumHeightWindow,
    smallHeightWindow
} from './modal.css';

export enum ModalSizes {
    LARGE = 'LARGE',
    MEDIUM = 'MEDIUM',
    SMALL = 'SMALL'
}

export interface ModalProps {
    title?: React.ReactNode;
    size?: ModalSizes;
    verticalSize?: ModalSizes;
    content?: React.ReactNode;
    confirmButtonContent?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    error?: Error | AppError;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface ModalApi {
    open(modalProps: ModalProps): void;
    close(): void;
}

interface Props {
    onApi(modalApi: ModalApi): void;
}

const {useState, useEffect, useContext} = React;
const contentClassNamesBySize: Record<ModalSizes, string> = {
    [ModalSizes.LARGE]: largeWindow,
    [ModalSizes.MEDIUM]: mediumWindow,
    [ModalSizes.SMALL]: smallWindow
};
const contentVerticalClassNamesBySize: Record<ModalSizes, string> = {
    [ModalSizes.LARGE]: largeHeightWindow,
    [ModalSizes.MEDIUM]: mediumHeightWindow,
    [ModalSizes.SMALL]: smallHeightWindow
};
const Modal: React.FunctionComponent<Props> = ({onApi}) => {
    const i18n = useContext(I18nContext);
    const history = useHistory();
    const [modalId, setModalId] = useState<string | undefined>(undefined);
    const [modalProps, setModalProps] = useState<ModalProps | undefined>();
    const close = () => setModalProps(undefined);
    const onCancel = (modalProps: ModalProps) => {
        close();
        modalProps.onCancel?.();
    };
    const onConfirm = (modalProps: ModalProps) => {
        close();
        modalProps.onConfirm?.();
    };
    const onModalBackdropClick = (modalProps: ModalProps, event: React.MouseEvent<HTMLElement>) => {
        // it's a click on modal backdrop
        if (event.currentTarget === event.target) {
            onCancel(modalProps);
        }
    };

    useEffect(() => {
        const open = (modalProps: ModalProps) => {
            // [WF-520]
            requestAnimationFrame(deactivateActiveElement);
            setModalId(generateElementId());
            setModalProps(modalProps);
        };

        onApi({open, close});

        // [WF-2461] close modal windows after navigation
        return history.listen(close);
    }, []);

    useEffect(() => {
        if (!modalProps) {
            return;
        }

        const onGlobalKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel(modalProps);
            }
        };

        document.addEventListener('keyup', onGlobalKeyUp, false);

        return () => document.removeEventListener('keyup', onGlobalKeyUp, false);
    }, [modalProps]);

    if (!modalProps) {
        return null;
    }

    const {size = ModalSizes.SMALL, verticalSize, confirmButtonContent, error, footer, header} = modalProps;
    const isErrorModal: boolean = Boolean(error);
    const isConfirmationModal: boolean = !isErrorModal && typeof modalProps.onConfirm === 'function';
    const closeButtonTitle = localize(i18n, 'modals.closeTitle');
    let modalTitle: React.ReactNode = modalProps.title;
    let modalContent: React.ReactNode = modalProps.content;

    if (error) {
        // If error is Error instance ot there is not error text, we should show a default message
        modalContent = modalContent || localize(i18n, (error as AppError).text || 'errors.serviceError');
    } else if (isConfirmationModal) {
        modalTitle = modalTitle || localize(i18n, 'modals.confirmTitle');
        modalContent = modalContent || localize(i18n, 'modals.confirmationTitle');
    }

    const hasTextOnlyContent: boolean = typeof modalContent === 'string';

    // we use portal to manage stacking context between Modal and Popovers (tooltip, dropdown menu, datepicker menu)
    // by using order in DOM and z-index
    return (
        <Portal>
            <div
                className={backdrop}
                data-name="modal"
                onClick={onModalBackdropClick.bind(null, modalProps)}
                key={modalId}>
                <div
                    className={`
                        ${modalWindow}
                        ${contentClassNamesBySize[size]}
                        ${verticalSize ? contentVerticalClassNamesBySize[verticalSize] : ''}
                    `}
                    role="dialog">
                    {/* We can pass `header: null` to remove header */}
                    {header !== undefined ? (
                        header
                    ) : (
                        <div className={headerClassName}>
                            <div className={headerTitle}>
                                {typeof modalTitle === 'string' ? (
                                    <InnerHtml key={modalId}>{modalTitle}</InnerHtml>
                                ) : (
                                    modalTitle
                                )}
                            </div>
                            <button
                                type="button"
                                className={selectableButtonWithBackdrop}
                                onClick={onCancel.bind(null, modalProps)}
                                aria-label={closeButtonTitle}>
                                <Icon type="close" />
                            </button>
                        </div>
                    )}
                    <div className={hasTextOnlyContent ? textOnlyContent : content}>
                        {hasTextOnlyContent ? (
                            <ExternalHtmlContent key={modalId}>{modalContent as string}</ExternalHtmlContent>
                        ) : (
                            modalContent
                        )}
                    </div>
                    {/* We can pass `footer: null` to remove footer */}
                    {footer !== undefined ? (
                        footer
                    ) : (
                        <div className={buttons}>
                            <button
                                type="button"
                                className={`${largeSizeButton} ${cancelButton}`}
                                onClick={onCancel.bind(null, modalProps)}>
                                {isConfirmationModal ? localize(i18n, 'trader.forms.actions.cancel') : closeButtonTitle}
                            </button>
                            {isConfirmationModal && (
                                <Button
                                    size={ButtonSizes.LARGE}
                                    variant={ButtonVariants.ACCENT}
                                    className={confirmButton}
                                    onClick={onConfirm.bind(null, modalProps)}>
                                    {confirmButtonContent || localize(i18n, 'trader.forms.actions.confirm')}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Portal>
    );
};

export default React.memo(Modal);
