import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {accentIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import * as React from 'react';

export interface ProductNoteIconProps {
    accent?: boolean;
    active?: boolean;
    className?: string;
}

const {memo} = React;
const ProductNoteIcon = memo<ProductNoteIconProps>(({accent = true, active, className = ''}) => (
    <Icon className={`${className} ${accent && active ? accentIcon : ''}`} type={active ? 'note' : 'note_outline'} />
));

ProductNoteIcon.displayName = 'ProductNoteIcon';
export default ProductNoteIcon;
