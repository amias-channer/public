import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {selectableText as selectableTextClassName} from 'frontend-core/dist/components/ui-trader4/selection-utils.css';
import * as React from 'react';
import {externalHtmlContent} from './external-html-content.css';

interface Props extends Omit<React.HTMLProps<HTMLElement>, 'ref'> {
    children: string | undefined | null;
    selectableText?: boolean;
}

const ExternalHtmlContent: React.FunctionComponent<Props> = ({
    children,
    className = '',
    selectableText,
    ...domProps
}) => (
    <InnerHtml
        {...domProps}
        className={`${externalHtmlContent} ${selectableText ? selectableTextClassName : ''} ${className}`}>
        {children}
    </InnerHtml>
);

export default React.memo(ExternalHtmlContent);
