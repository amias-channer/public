import CoreIcon from 'frontend-core/dist/components/ui-common/icon/index';
import * as React from 'react';

CoreIcon.getIconsTemplates = () => {
    return import(/* webpackChunkName: "icons-templates" */ './icons-templates').then((_) => _.default);
};

export default class Icon extends CoreIcon {}
