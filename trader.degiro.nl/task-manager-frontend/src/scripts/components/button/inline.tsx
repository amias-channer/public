import * as React from 'react';
import {buttonInline} from './button.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const InlineButton: React.FunctionComponent<Props> = (props) => {
    return (
        <button type="button" {...props} className={`${buttonInline} ${props.className || ''}`}>
            {props.children}
        </button>
    );
};

export default InlineButton;
