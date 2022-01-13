import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Icon from '../icon/index';
import {closeButton, closeButtonIcon, hint, layout} from './text-with-hints.css';

interface Props {
    translationCode: string;
    className?: string;
    hintClassName?: string;
    renderHint?: (hintTranslationCode: string) => React.ReactNode | React.ReactNode[];
    renderContent?: (contentTranslationCode: string) => React.ReactNode | React.ReactNode[];
}

const findHintCode = (rootEl: HTMLElement, el: HTMLElement | null, hintAttributeName: string): string | null => {
    if (!el || el === rootEl) {
        return null;
    }
    const hintCode = el.getAttribute(hintAttributeName);

    if (hintCode) {
        return hintCode;
    }

    return findHintCode(rootEl, el.parentElement, hintAttributeName);
};
const {useState, useContext} = React;
const TextWithHints: React.FunctionComponent<Props> = ({
    renderHint,
    renderContent,
    translationCode,
    className = '',
    hintClassName = ''
}) => {
    const i18n = useContext(I18nContext);
    const [hintTranslationCode, setHintTranslationCode] = useState<string | null>(null);
    const onToggleHint = (event: React.MouseEvent<HTMLElement>) => {
        const el = event.target as HTMLElement;
        const {currentTarget: rootEl} = event;
        const shortHintCode: string | null = findHintCode(rootEl, el, 'data-hint-code');
        let newHintTranslationCode: string | null;

        // if hint is already shown or there is no short version of the hint, then we can show the full hint text
        if (hintTranslationCode || shortHintCode === null) {
            newHintTranslationCode = findHintCode(rootEl, el, 'data-full-hint-code');
        } else {
            newHintTranslationCode = `${translationCode}.hints.${shortHintCode}`;
        }

        if (newHintTranslationCode) {
            event.preventDefault();
            setHintTranslationCode(newHintTranslationCode === hintTranslationCode ? null : newHintTranslationCode);
        }
    };

    return (
        <div className={`${layout} ${className}`} data-name="textWithHints" onClick={onToggleHint}>
            {renderContent ? renderContent(translationCode) : <InnerHtml>{localize(i18n, translationCode)}</InnerHtml>}
            {hintTranslationCode && (
                <div data-name="hint" className={`${hint} ${hintClassName}`}>
                    <button
                        type="button"
                        data-name="hintCloseButton"
                        className={closeButton}
                        onClick={setHintTranslationCode.bind(null, null)}>
                        <Icon className={closeButtonIcon} type="times_regular" />
                    </button>
                    {renderHint ? (
                        renderHint(hintTranslationCode)
                    ) : (
                        <InnerHtml>{localize(i18n, hintTranslationCode)}</InnerHtml>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(TextWithHints);
