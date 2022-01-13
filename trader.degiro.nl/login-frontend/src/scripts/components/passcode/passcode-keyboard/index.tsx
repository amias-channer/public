import * as React from 'react';
import touchIdImgUrl from '../../../../images/svg/touch-id.svg';
import Icon from '../../icon';
import {keyboard, keyboardButton, keyboardButtonIcon, keyboardButtonImg} from './passcode-keyboard.css';

interface Props {
    passCode: string;
    onBiometricAuthSelect?: () => void;
    onDigitEnter: (value: string) => void;
    onBackSpace: () => void;
}

const {useCallback} = React;
const PassCodeKeyboard: React.FunctionComponent<Props> = ({
    passCode,
    onDigitEnter,
    onBackSpace,
    onBiometricAuthSelect
}) => {
    const keyboardButtons: React.ReactElement[] = [];
    const keysCount: number = 10;
    const onKeyboardButtonClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            const digit: string | undefined = event.currentTarget.dataset?.id;

            if (digit) {
                onDigitEnter(digit);
            }
        },
        [onDigitEnter]
    );

    for (let i = 1; i <= keysCount; i++) {
        const num = i % keysCount;

        keyboardButtons[i] = (
            <button
                key={String(num)}
                type="button"
                data-id={num}
                onClick={onKeyboardButtonClick}
                className={keyboardButton}>
                {num}
            </button>
        );
    }

    // insert before "0" key
    keyboardButtons.splice(
        keysCount,
        0,
        onBiometricAuthSelect ? (
            <button type="button" className={keyboardButton} onClick={onBiometricAuthSelect}>
                <img className={keyboardButtonImg} width={36} height={36} src={touchIdImgUrl} alt="Biometric auth" />
            </button>
        ) : (
            <div className={keyboardButton} />
        )
    );
    keyboardButtons.push(
        <button
            key="backspace"
            type="button"
            data-id="backspace"
            className={keyboardButton}
            disabled={!passCode.length}
            onClick={onBackSpace}>
            <Icon className={keyboardButtonIcon} type="backspace_solid" />
        </button>
    );

    return <div className={keyboard}>{keyboardButtons}</div>;
};

export default React.memo(PassCodeKeyboard);
