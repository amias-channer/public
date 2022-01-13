import * as React from 'react';
import onExternalLinkClick from '../../../platform/navigation/on-external-link-click';
/**
 * @see https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
 * @see https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/
 * @param {NewTabLinkProps} props
 * @returns {React.ReactElement}
 */
const NewTabLink = React.forwardRef((props, ref) => {
    return (React.createElement("a", { ref: ref, target: "_blank", onClick: onExternalLinkClick, ...props, rel: `${props.rel || ''} noopener noreferrer` }, props.children));
});
NewTabLink.displayName = 'NewTabLink';
export default NewTabLink;
//# sourceMappingURL=index.js.map