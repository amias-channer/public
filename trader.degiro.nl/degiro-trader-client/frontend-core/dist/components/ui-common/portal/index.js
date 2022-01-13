import * as React from 'react';
import { createPortal } from 'react-dom';
const { useState, useLayoutEffect } = React;
function createElement() {
    const el = document.createElement('div');
    el.dataset.name = 'portal';
    return el;
}
const Portal = ({ children }) => {
    const [el] = useState(createElement);
    useLayoutEffect(() => {
        document.body.appendChild(el);
        return () => el.remove();
    }, []);
    return createPortal(children, el);
};
export default React.memo(Portal);
//# sourceMappingURL=index.js.map