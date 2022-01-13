import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {navButton} from './datepicker.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    forward?: boolean;
}

const NavButton: React.FunctionComponent<Props> = ({forward, ...buttonProps}) => (
    <button className={navButton} type="button" tabIndex={-1} {...buttonProps}>
        <Icon type={forward ? 'keyboard_arrow_right' : 'keyboard_arrow_left'} />
    </button>
);

export default React.memo(NavButton);
