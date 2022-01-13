import useAsync from 'frontend-core/dist/hooks/use-async';
import localize from 'frontend-core/dist/services/i18n/localize';
import {addDocumentKeydownStackableEventListener} from 'frontend-core/dist/utils/events/add-stackable-event-listener';
import * as React from 'react';
import {ProductNote as ProductNoteModel} from '../../models/product-note';
import removeProductNote from '../../services/product-notes/remove-product-note';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import DateValue from '../value/date';
import Button, {ButtonVariants} from '../button';
import {
    buttonSection,
    disabledProductNote,
    noteSection,
    primaryOrder,
    productNote,
    serviceMessage,
    serviceMessageWarning,
    text,
    timeStamp
} from './product-notes.css';

export type ProductNoteMode = 'view' | 'remove-prompt' | 'removing';

interface Props {
    note: ProductNoteModel;
    onRemove?: (note: ProductNoteModel) => void;
    onEdit?: (note: ProductNoteModel) => void;
    onModeChange?: (mode: ProductNoteMode, note: ProductNoteModel) => void;
    autofocus?: boolean;
    disabled?: boolean;
}

const {useState, useEffect, useRef, useCallback, useLayoutEffect, useContext} = React;
const ProductNote: React.FunctionComponent<Props> = ({
    note,
    onModeChange,
    onRemove,
    onEdit,
    autofocus = false,
    disabled = false
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const rootNode = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<ProductNoteMode>('view');
    const updateMode = useCallback(
        (newMode: ProductNoteMode) => {
            setMode(newMode);
            onModeChange?.(newMode, note);
        },
        [setMode, onModeChange]
    );
    const {value: result} = useAsync<true | undefined>(() => {
        if (mode === 'removing') {
            return removeProductNote(config, note.id);
        }
        return Promise.resolve(undefined);
    }, [mode]);
    const switchToRemovePromptMode = useCallback(() => updateMode('remove-prompt'), []);
    const switchToRemovingMode = useCallback(() => updateMode('removing'), []);
    const switchToViewMode = useCallback(() => {
        rootNode.current?.focus();
        updateMode('view');
    }, []);

    useEffect(() => {
        if (result) {
            onRemove?.(note);
        }
    }, [result]);

    useLayoutEffect(() => {
        addDocumentKeydownStackableEventListener(
            () => onEdit?.(note),
            ({key}) => rootNode.current === document.activeElement && key === 'Enter'
        );
    }, []);

    useLayoutEffect(() => {
        addDocumentKeydownStackableEventListener(
            (event) => {
                event.preventDefault();
                return updateMode('remove-prompt');
            },
            ({key}) =>
                rootNode.current === document.activeElement &&
                (key === 'Delete' || key === 'Backspace') &&
                mode !== 'remove-prompt'
        );
    }, []);

    useEffect(() => {
        if (autofocus) {
            rootNode.current?.focus();
        }
    }, []);

    // IMPORTANT: this is workaround: Preact does not remove tabIndex
    //            if you try to set `tabIndex = {undefined}` it set `tabindex = 0` instead
    useLayoutEffect(() => {
        if (disabled) {
            rootNode.current?.removeAttribute('tabindex');
        } else {
            rootNode.current?.setAttribute('tabindex', '0');
        }
    }, [disabled]);

    return (
        <div
            ref={rootNode}
            className={`${productNote} ${disabled ? disabledProductNote : ''}`}
            tabIndex={disabled ? undefined : 0}>
            <div className={`${noteSection} ${text}`}>{note.text}</div>
            {mode === 'view' && (
                <div className={buttonSection}>
                    <div className={serviceMessage}>
                        <span className={timeStamp}>
                            {localize(i18n, 'trader.productNotes.lastModified')}:&nbsp;
                            <DateValue id={note.id} field="stampModified" value={note.stampModified} />
                        </span>
                    </div>
                    <Button
                        data-test-key="edit-button"
                        disabled={disabled}
                        onClick={onEdit?.bind(null, note)}
                        variant={ButtonVariants.GHOST}>
                        {localize(i18n, 'trader.forms.actions.edit')}
                    </Button>
                    <Button
                        data-test-key="call-delete-prompt-button"
                        disabled={disabled}
                        onClick={switchToRemovePromptMode}
                        variant={ButtonVariants.GHOST}>
                        {localize(i18n, 'trader.forms.actions.delete')}
                    </Button>
                </div>
            )}
            {mode !== 'view' && (
                <div className={buttonSection}>
                    <div className={`${serviceMessage} ${serviceMessageWarning}`}>
                        {localize(i18n, 'trader.productNotes.areYouSureWantToDeleteNote')}
                    </div>
                    <Button
                        autoFocus={true}
                        className={primaryOrder}
                        data-test-key="cancel-delete-prompt-button"
                        onClick={switchToViewMode}
                        variant={ButtonVariants.GHOST}>
                        {localize(i18n, 'trader.forms.actions.cancel')}
                    </Button>
                    <Button
                        data-test-key="delete-button"
                        inTransition={mode === 'removing'}
                        onClick={switchToRemovingMode}
                        variant={ButtonVariants.GHOST}>
                        {localize(i18n, 'trader.forms.actions.remove')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductNote);
