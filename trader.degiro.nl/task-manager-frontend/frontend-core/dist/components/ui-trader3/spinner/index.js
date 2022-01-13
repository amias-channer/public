import * as React from 'react';
const Spinner = (props) => {
    const spinner = (React.createElement("div", { "data-name": "spinner", className: `spinner ${props.className || ''}` }));
    if (props.inline) {
        return spinner;
    }
    if (props.local) {
        return (React.createElement("div", { className: "spinner-local-layout" },
            React.createElement("div", { className: "spinner-backing" }, spinner)));
    }
    return (React.createElement("div", { className: "spinner-global-layout" },
        React.createElement("div", { className: "spinner-backing" }, spinner)));
};
export default Spinner;
//# sourceMappingURL=index.js.map