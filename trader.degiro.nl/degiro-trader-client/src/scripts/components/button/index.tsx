import areComponentChildrenEmpty from 'frontend-core/dist/components/ui-common/component/are-component-children-empty';
import Icon, {IconType} from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {
    disabledButton,
    filledAccentButton,
    filledButton,
    ghostButton,
    largeSizeButton,
    outlinedButton,
    regularSizeButton,
    smallSizeButton,
    transition
} from './button.css';

export enum ButtonSizes {
    LARGE = 'LARGE',
    SMALL = 'SMALL'
}

export enum ButtonVariants {
    ACCENT = 'ACCENT',
    GHOST = 'GHOST',
    OUTLINED = 'OUTLINED'
}

interface ButtonClassNameProps {
    className?: string;
    disabled?: boolean;
    inTransition?: boolean;
    size?: ButtonSizes;
    variant?: ButtonVariants;
}

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>, ButtonClassNameProps {
    icon?: IconType;
}

const classNamesByVariant: Record<ButtonVariants, string> = {
    [ButtonVariants.ACCENT]: filledAccentButton,
    [ButtonVariants.GHOST]: ghostButton,
    [ButtonVariants.OUTLINED]: outlinedButton
};

export function getButtonClassName({
    className = '',
    disabled,
    inTransition,
    size,
    variant
}: ButtonClassNameProps = {}): string {
    return [
        size === ButtonSizes.SMALL ? smallSizeButton : size === ButtonSizes.LARGE ? largeSizeButton : regularSizeButton,
        variant ? classNamesByVariant[variant] : filledButton,
        disabled ? disabledButton : '',
        inTransition ? transition : '',
        className
    ].join(' ');
}

const {useLayoutEffect, useRef} = React;
const Button: React.FunctionComponent<ButtonProps> = (props) => {
    const {autoFocus, children, icon, inTransition, variant, ...buttonProps} = props;
    const rootNodeRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (autoFocus) {
            rootNodeRef.current?.focus();
        }
    }, []);

    return (
        <button ref={rootNodeRef} type="button" {...buttonProps} className={getButtonClassName(props)}>
            {icon ? <Icon type={icon} inlineLeft={!areComponentChildrenEmpty(children)} /> : null}
            {children}
        </button>
    );
};

export default React.memo(Button);
