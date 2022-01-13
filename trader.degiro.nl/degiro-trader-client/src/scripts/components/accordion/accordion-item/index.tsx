import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import ExternalHtmlContent from '../../external-html-content';
import {
    openedContentWrapper,
    content as contentClassName,
    item,
    itemHeader,
    header as headerClassName,
    contentWrapper,
    icon
} from './accordion-item.css';

export interface AccordionItemProps {
    isOpened?: boolean;
    header: React.ReactNode;
    className?: string;
    onToggle: () => void;
}

const {useEffect, useRef, useState, useCallback} = React;
const AccordionItem: React.FunctionComponent<React.PropsWithChildren<AccordionItemProps>> = ({
    header,
    children,
    isOpened,
    className = '',
    onToggle
}) => {
    const [isClicked, setIsClicked] = useState(false);
    const accordionItemRef = useRef<HTMLDivElement | null>(null);
    const onClick = useCallback(() => {
        setIsClicked(true);
        onToggle();
    }, [onToggle]);

    useEffect(() => {
        const {current: accordionItem} = accordionItemRef;

        if (isClicked && isOpened && accordionItem) {
            // [REFINITIV-2309] - scroll item only when it is clicked (prevent the case when
            // the item is opened from another action (i.e. expand all))
            setIsClicked(false);
            accordionItem.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }
    }, [isOpened, isClicked]);

    return (
        <li className={`${item} ${className}`}>
            <button type="button" className={itemHeader} onClick={onClick}>
                <div className={headerClassName}>
                    {typeof header === 'string' ? <ExternalHtmlContent>{header}</ExternalHtmlContent> : header}
                </div>
                <Icon className={icon} flipped={isOpened} type="keyboard_arrow_down" />
            </button>
            <div
                ref={isOpened ? accordionItemRef : null}
                className={`${contentWrapper} ${isOpened ? openedContentWrapper : ''}`}>
                {isOpened && <div className={contentClassName}>{children}</div>}
            </div>
        </li>
    );
};

export default React.memo(AccordionItem);
