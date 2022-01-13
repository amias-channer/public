import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {activeOption, option, switchControl, switchControlInTransition} from './switch-buttons.css';

export interface SwitchButtonsProps {
    checked?: boolean;
    className?: string;
    activeOptionClassName?: string;
    fromOption?: React.ReactNode;
    toOption?: React.ReactNode;
    disabled?: boolean;
    name?: string;
    inTransition?: boolean;
    transitionClassName?: string;
    transitionLabel?: string;
    onChange(): any;
}

const {useContext} = React;
const SwitchButtons: React.FunctionComponent<SwitchButtonsProps> = ({
    className = '',
    checked,
    disabled,
    inTransition,
    transitionLabel,
    fromOption,
    toOption,
    onChange,
    activeOptionClassName: activeOptionClassNameFromProps = ''
}) => {
    const i18n = useContext(I18nContext);
    const activeOptionClassName: string = `${activeOption} ${activeOptionClassNameFromProps}`;

    return (
        <div
            className={`${switchControl} ${inTransition ? switchControlInTransition : ''} ${className}`}
            aria-checked={checked}
            aria-readonly={disabled}
            role="switch">
            {inTransition ? (
                <div className={option} role="progressbar">
                    <Icon type="sync" spin={true} inlineLeft={true} />
                    {transitionLabel || localize(i18n, 'trader.settings.transitionLabel')}
                </div>
            ) : (
                <button
                    type="button"
                    className={`${option} ${checked ? activeOptionClassName : ''}`}
                    disabled={disabled}
                    onClick={checked ? undefined : onChange}>
                    {fromOption || localize(i18n, 'trader.settings.enableAction')}
                </button>
            )}
            {!inTransition && (
                <button
                    type="button"
                    className={`${option} ${checked ? '' : activeOptionClassName}`}
                    disabled={disabled}
                    onClick={checked ? onChange : undefined}>
                    {toOption || localize(i18n, 'trader.settings.disableAction')}
                </button>
            )}
        </div>
    );
};

export default React.memo(SwitchButtons);
