import * as React from 'react';
import deactivateActiveElement from '../../../platform/deactivate-active-element';
import isAppError from '../../../services/app-error/is-app-error';
import localize from '../../../services/i18n/localize';
import Icon from '../../ui-common/icon/index';
import InnerHtml from '../../ui-common/inner-html';
import * as modalStyles from './modal.css';
export default class Modal extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
        this.onActionButtonClick = (action, event) => {
            const { onClick } = action.props || {};
            if (typeof onClick === 'function') {
                onClick(event);
            }
            // close by default
            if (action.closeModal !== false) {
                this.close();
            }
        };
        this.open = (modalProps) => {
            this.setState({ modalProps });
        };
        this.openErrorModal = (error, props) => {
            const { i18n } = this.props;
            let title = (props === null || props === void 0 ? void 0 : props.title) || '';
            if (isAppError(error) && error.text) {
                // it can be a translation of the error message, so try to find it in i18n
                title = localize(i18n, error.text);
            }
            // [WF-520]
            deactivateActiveElement();
            this.open({
                error: true,
                icon: 'exclamation_solid',
                content: title || localize(i18n, 'errors.serviceError'),
                actions: [
                    {
                        component: 'button',
                        content: localize(i18n, 'modals.closeTitle')
                    }
                ],
                ...props
            });
        };
        this.close = () => {
            this.setState({ modalProps: undefined });
        };
    }
    componentDidMount() {
        this.props.onApi({
            open: this.open,
            openErrorModal: this.openErrorModal,
            close: this.close
        });
    }
    render() {
        const { modalProps } = this.state;
        if (!modalProps) {
            return null;
        }
        const { title, icon, content, actions, error, warning } = modalProps;
        return (React.createElement("div", { className: modalStyles.overlay },
            React.createElement("div", { className: modalStyles.modal, "data-name": "modal" },
                icon && (React.createElement("div", { "data-name": "modalIconWrapper", "data-mode": error ? 'error' : warning ? 'warning' : 'normal', className: `
                                ${modalStyles.modalIconWrapper}
                                ${error ? modalStyles.modalIconWrapperError : ''}
                                ${warning ? modalStyles.modalIconWrapperWarning : ''}
                            ` }, typeof icon === 'string' ? (React.createElement(Icon, { "data-name": "modalIcon", "data-type": icon, type: icon, className: modalStyles.modalIcon })) : (icon))),
                title && (React.createElement("h1", { className: `${modalStyles.modalTitle} ${error ? modalStyles.modalTitleError : ''}` }, title)),
                React.createElement("div", { "data-name": "modalContent", className: modalStyles.modalContent }, typeof content === 'string' ? React.createElement(InnerHtml, null, content) : content),
                actions && actions[0] && (React.createElement("div", { className: modalStyles.modalActions }, actions.map((action, index, actions) => {
                    const isSingleActionsItem = index === 0 && !actions[1];
                    const ActionButton = action.component;
                    return (React.createElement(ActionButton, { ...action.props, key: `action-${index}`, className: `
                                            ${modalStyles.modalActionsItem}
                                            ${isSingleActionsItem ? modalStyles.modalActionsItemSingle : ''}
                                        `, "data-name": "modalActionsItem", "data-mode": isSingleActionsItem ? 'single' : 'normal', onClick: this.onActionButtonClick.bind(null, action) }, action.content));
                }))))));
    }
}
//# sourceMappingURL=index.js.map