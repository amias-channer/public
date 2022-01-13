import * as React from 'react';
import onExternalLinkClick from '../../../platform/navigation/on-external-link-click';
import sanitize from '../../../utils/sanitize';
// Use this component instead of dangerouslySetInnerHTML
const InnerHtml = ({ children, ...props }) => (React.createElement("span", { onClick: onExternalLinkClick, ...props, children: undefined, 
    // eslint-disable-next-line react/forbid-dom-props
    dangerouslySetInnerHTML: children ? { __html: sanitize(children) } : undefined }));
export default React.memo(InnerHtml);
//# sourceMappingURL=index.js.map