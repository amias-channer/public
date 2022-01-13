import * as React from 'react';
export default function ExchangeName({ exchange, className }) {
    return (React.createElement("span", { "data-id": exchange && exchange.id, "data-name": "exchangeName", className: className || '' }, exchange && exchange.name));
}
//# sourceMappingURL=index.js.map