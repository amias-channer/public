import * as React from 'react';
import ExternalHtmlContent from '../../../external-html-content';
import {
    content as contentClassName,
    fieldDescription,
    title as titleClassName,
    label as labelClassName
} from './tooltip-description-line.css';

interface Props {
    content?: React.ReactNode;
    label?: string;
    title?: string;
}

const TooltipDescriptionLine: React.FunctionComponent<Props> = ({title, content, label}) => (
    <dl className={fieldDescription}>
        {label && <dt className={labelClassName}>{label}</dt>}
        {title && <dt className={titleClassName}>{title}</dt>}
        <dd className={contentClassName}>
            {typeof content === 'string' ? <ExternalHtmlContent>{content}</ExternalHtmlContent> : content}
        </dd>
    </dl>
);

export default React.memo(TooltipDescriptionLine);
