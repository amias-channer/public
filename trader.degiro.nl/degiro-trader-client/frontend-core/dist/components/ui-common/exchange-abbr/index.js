import * as React from 'react';
export default function ExchangeAbbr(props) {
    const { hiqAbbr = '', id = '' } = props.exchange || {};
    return (React.createElement("span", { "data-id": id, "data-name": "exchangeAbbr", className: props.className || '' }, hiqAbbr));
}
//# sourceMappingURL=index.js.map