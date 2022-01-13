import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import * as React from 'react';
import {AppApiContext} from '../app-component/app-context';
import {ModalSizes} from '../modal';
import {button, icon as iconClassName, label as labelClassName} from './popup-button.css';

const {useContext} = React;

export interface PopupButtonProps {
    label?: string;
    title?: React.ReactNode;
    children: string | React.ReactElement;
}

interface PopupInfoButtonProps extends PopupButtonProps {
    infoIcon: true;
}

interface PopupHintButtonProps extends PopupButtonProps {
    hintIcon: true;
}

type Props = PopupInfoButtonProps | PopupHintButtonProps;

const PopupButton: React.FunctionComponent<Props> = ({title, label, children, ...props}) => {
    const app = useContext(AppApiContext);
    const openModal = () => app.openModal({size: ModalSizes.MEDIUM, title, content: children, footer: null});

    return (
        <>
            {label && (
                <button type="button" onClick={openModal} className={labelClassName}>
                    {label}
                </button>
            )}
            <button type="button" className={button} onClick={openModal}>
                <Icon className={iconClassName} {...props} />
            </button>
        </>
    );
};

export default React.memo(PopupButton);
