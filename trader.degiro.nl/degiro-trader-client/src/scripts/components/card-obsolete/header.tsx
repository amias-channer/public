import * as React from 'react';
import {cardHeader, cardHeaderTitle} from './card.css';

interface Props {
    className?: string;
    title?: React.ReactNode;
}

/**
 * @deprecated please use card/header component
 */
const CardHeader: React.FunctionComponent<Props> = React.memo(({title, className = '', children}) => (
    <header className={`${cardHeader} ${className}`}>
        {title && <h2 className={cardHeaderTitle}>{title}</h2>}
        {children}
    </header>
));

CardHeader.displayName = 'CardHeader';

export default CardHeader;
