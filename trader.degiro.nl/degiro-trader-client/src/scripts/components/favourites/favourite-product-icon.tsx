import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {accentIcon} from 'frontend-core/dist/components/ui-trader4/icon/icon.css';
import * as React from 'react';

interface Props {
    accent?: boolean;
    active: boolean;
    className?: string;
}
const {memo} = React;
const FavouriteProductIcon = memo<Props>(({accent = true, active, className = ''}) => (
    <Icon type={active ? 'star' : 'star_outline'} className={`${accent && active ? accentIcon : ''} ${className}`} />
));

FavouriteProductIcon.displayName = 'FavouriteProductIcon';
export default FavouriteProductIcon;
