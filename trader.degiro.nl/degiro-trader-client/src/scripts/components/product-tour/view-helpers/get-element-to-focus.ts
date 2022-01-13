import {ProductTourSteps} from '../state-helpers/steps';
import {querySelectorsForCompactMode, querySelectorsForFullMode} from './selectors';

export default function getElementToFocus(step: ProductTourSteps, options: {compact: boolean}): HTMLElement | null {
    const selector: string | undefined = options.compact
        ? querySelectorsForCompactMode[step]
        : querySelectorsForFullMode[step];

    if (!selector) {
        return null;
    }

    return document.querySelector<HTMLElement>(selector);
}
