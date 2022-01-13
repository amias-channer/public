import * as React from 'react';
import { logErrorLocally } from '../../../loggers/local-logger';
import createCancellablePromise from '../../../utils/async/create-cancellable-promise';
import * as iconStyles from './icon.css';
// TODO: simplify core Icon realization
export default class Icon extends React.PureComponent {
    componentDidMount() {
        // We should update templates in the base Icon class, because it can be used in the inner components
        if (!Icon.iconsTemplates) {
            this.templatesPromise = createCancellablePromise(Icon.getIconsTemplates());
            this.templatesPromise.promise
                .then((iconsTemplates) => {
                Icon.iconsTemplates = iconsTemplates;
                this.forceUpdate();
            })
                .catch(logErrorLocally);
        }
    }
    componentWillUnmount() {
        var _a;
        (_a = this.templatesPromise) === null || _a === void 0 ? void 0 : _a.cancel();
        this.templatesPromise = undefined;
    }
    render() {
        const { hintIcon: hintIconType, infoIcon: infoIconType, iconsTemplates } = Icon;
        const { hintIcon, infoIcon, type = hintIcon ? hintIconType : infoIcon ? infoIconType : undefined, scale, verticalAlign, inlineRight, inlineLeft, ...domProps } = this.props;
        const template = iconsTemplates && iconsTemplates[type];
        if (iconsTemplates && !template) {
            logErrorLocally(`Icon ${type} not found`, this.props);
        }
        /* eslint-disable react/forbid-dom-props */
        return (React.createElement("i", { role: "img", "data-name": "icon", "data-type": type, "aria-hidden": "true", ...domProps, dangerouslySetInnerHTML: template ? { __html: template } : undefined, className: Icon.getElementClassName(this.props) }));
    }
    static getElementClassName(props) {
        const { verticalAlign, scale = 1 } = props;
        return [
            iconStyles.icon,
            (scale >= 2 && iconStyles[`icon${scale}x`]) || '',
            props.inlineRight ? iconStyles.iconInlineRight : props.inlineLeft ? iconStyles.iconInlineLeft : '',
            verticalAlign === 'middle'
                ? iconStyles.iconVerticalAlignMiddle
                : verticalAlign === 'top'
                    ? iconStyles.iconVerticalAlignTop
                    : verticalAlign === 'bottom'
                        ? iconStyles.iconVerticalAlignBottom
                        : '',
            props.className || ''
        ]
            .filter(Boolean)
            .join(' ');
    }
    static getIconsTemplates() {
        return Promise.reject(new Error('static method getIconsTemplates is not implemented'));
    }
}
Icon.hintIcon = 'question-circle_solid';
Icon.infoIcon = 'info-circle_solid';
//# sourceMappingURL=index.js.map