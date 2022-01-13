import * as React from 'react';
import range from 'frontend-core/dist/utils/range';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {optionsList} from './options-list.css';

interface Props {
    length: number;
    activeItemIndex: number;
    children: (i: number) => React.ReactNode;
}
const {forwardRef, memo} = React;
const scrollIntoView = (el: HTMLElement | null): void => {
    if (!el) {
        return;
    }
    // Move scrollIntoView to next-tick.
    // We need to wait until target element is mount and after that trigger `.scrollIntoView`
    Promise.resolve()
        .then(() => el.scrollIntoView({block: 'center'}))
        .catch(logErrorLocally);
};
const OptionsList = memo(
    forwardRef<HTMLDivElement, Props>(({length, children, activeItemIndex}, ref) => (
        <div className={optionsList} ref={ref}>
            {range(0, length - 1).map((i) => {
                const isActive = activeItemIndex === i;

                return (
                    <div key={i} ref={isActive ? scrollIntoView : null}>
                        {children(i)}
                    </div>
                );
            })}
        </div>
    ))
);

OptionsList.displayName = 'OptionsList';
export default OptionsList;
