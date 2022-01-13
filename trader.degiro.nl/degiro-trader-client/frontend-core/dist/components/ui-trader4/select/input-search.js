import * as React from 'react';
import getDisabledAutofillAttrs from '../form/get-disabled-autofill-attrs';
import { controlField, controlFieldWithActiveSearch } from './select.css';
const selectControlName = 'selectControl';
const { useRef, useLayoutEffect } = React;
const InputSearch = (props) => {
    const rootElRef = useRef(null);
    const isSearchBox = props.role === 'searchbox';
    const { autoFocus } = props;
    useLayoutEffect(() => {
        const { current: rootEl } = rootElRef;
        // [STRYPES-396] autoFocus doesn't work always in Edge and then "blur" is not triggered
        if (rootEl && autoFocus) {
            requestAnimationFrame(() => rootEl.focus());
        }
    }, [autoFocus]);
    return (React.createElement("input", { ...props, ...getDisabledAutofillAttrs(selectControlName), ref: rootElRef, 
        // Do not open keyboard on mobile devices for control field:
        // it should fire "blur" event to close the dropdown, but as it's not a search filed
        // we do not need a keyboard
        readOnly: !isSearchBox, "data-name": selectControlName, className: `${controlField} ${isSearchBox ? controlFieldWithActiveSearch : ''}` }));
};
export default React.memo(InputSearch);
//# sourceMappingURL=input-search.js.map