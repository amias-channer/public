import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import localize from 'frontend-core/dist/services/i18n/localize';
import {isKey} from 'frontend-core/dist/platform/keyboard';
import isNull from 'frontend-core/dist/utils/is-null';
import * as React from 'react';
import createRange from './create-range';
import Input from '../input';
import {defaultGroupSize} from '../../models/pagination';
import {I18nContext} from '../app-component/app-context';
import {pageInput, pageInputControl, button as baseButton, disabledButton, layout} from './pagination-buttons.css';

interface Props {
    pagesCount: number;
    pageNumber: number;
    groupSize?: number;
    separator?: string;
    className?: string;
    onChange(pageNumber: number): void;
}

const {useCallback, useContext, useRef} = React;
const PaginationButtons: React.FunctionComponent<Props> = ({
    pagesCount,
    groupSize = defaultGroupSize,
    className = '',
    separator = '...',
    pageNumber,
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const goToPageInputRef = useRef<HTMLInputElement | null>(null);
    const onPageNumberClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const el: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
        const pageNumber: string | undefined = el.dataset && el.dataset.pageNumber;

        deactivateActiveElement();
        if (pageNumber) {
            onChange(Number(pageNumber));
        }
    };
    const goToPage = useCallback(
        (value: string): void => {
            const goToPageNumber = Number(value);

            if (goToPageNumber <= pagesCount && goToPageNumber > 0) {
                onChange(goToPageNumber - 1);
            } else if (!isNull(goToPageInputRef.current)) {
                goToPageInputRef.current.value = String(pageNumber + 1);
            }
        },
        [pageNumber, pagesCount, onChange]
    );
    const onGoToPageKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isKey(event, 'Enter')) {
                return;
            }

            goToPage(event.currentTarget.value);
        },
        [goToPage]
    );
    const onFocusOutGoToPage = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            goToPage(event.currentTarget.value);
        },
        [goToPage]
    );
    const {range: pagesRange, separatorIndices} = createRange({pagesCount, currentPage: pageNumber, groupSize});
    const pagesRangeSize: number = pagesRange.length;
    const isPrevButtonEnabled: boolean = Boolean(pageNumber && pagesRangeSize > 1);
    const isNextButtonEnabled: boolean = pagesRangeSize > 1 && pageNumber !== pagesRange[pagesRangeSize - 1];

    return (
        <div data-name="pagination" aria-label="Pagination" className={`${layout} ${className}`}>
            <button
                type="button"
                title={String(pageNumber)}
                aria-label="Previous page"
                className={`${baseButton} ${isPrevButtonEnabled ? '' : disabledButton}`}
                disabled={!isPrevButtonEnabled}
                data-name="prevPageButton"
                data-page-number={pageNumber - 1}
                onClick={isPrevButtonEnabled ? onPageNumberClick : undefined}>
                <Icon type="keyboard_arrow_left" />
            </button>
            {pagesRange.map(
                (value: number, index: number): React.ReactNode => (
                    <React.Fragment key={`page-${value}`}>
                        {value !== pageNumber ? (
                            <button
                                type="button"
                                title={String(value + 1)}
                                data-name="pageButton"
                                data-page-number={value}
                                className={baseButton}
                                onClick={onPageNumberClick}>
                                {value + 1}
                            </button>
                        ) : (
                            <Input
                                ref={goToPageInputRef}
                                name="goToPage"
                                type="number"
                                data-name="goToPageInput"
                                value={value + 1}
                                className={pageInput}
                                controlClassName={pageInputControl}
                                onKeyDown={onGoToPageKeyDown}
                                onBlur={onFocusOutGoToPage}
                                title={localize(i18n, 'trader.pagination.goTo')}
                            />
                        )}
                        {separatorIndices[index] && (
                            <span
                                key={`${value}-separator`}
                                aria-hidden="true"
                                data-name="pagesSeparator"
                                className={baseButton}>
                                {separator}
                            </span>
                        )}
                    </React.Fragment>
                )
            )}
            <button
                type="button"
                title={String(pageNumber + 2)}
                aria-label="Next page"
                className={`${baseButton} ${isNextButtonEnabled ? '' : disabledButton}`}
                disabled={!isNextButtonEnabled}
                data-name="nextPageButton"
                data-page-number={pageNumber + 1}
                onClick={isNextButtonEnabled ? onPageNumberClick : undefined}>
                <Icon type="keyboard_arrow_right" />
            </button>
        </div>
    );
};

export default React.memo(PaginationButtons);
