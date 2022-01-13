import * as React from 'react';
import PopupButton, {PopupButtonProps} from '../index';

const PopupHintButton: React.FunctionComponent<PopupButtonProps> = ({title, children, label}) => (
    <PopupButton title={title} label={label} hintIcon={true}>
        {children}
    </PopupButton>
);

export default React.memo(PopupHintButton);
