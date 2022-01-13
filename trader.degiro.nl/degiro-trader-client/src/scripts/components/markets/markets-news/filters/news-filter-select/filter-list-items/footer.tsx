import * as React from 'react';
import {OptionId, Option} from './index';
import {buttonsLine} from '../../../../../favourites/favourite-product-settings/favourite-product-settings.css';
import FooterActionButtons from '../../footer-actions-buttons';
import {footerButtons} from '../news-filter-select.css';

interface Props {
    apply(): void;
    onChange: React.Dispatch<React.SetStateAction<number[]>>;
    options: Option[];
    hasSelectedValues: boolean;
}

const {memo, useMemo, useCallback} = React;
const Footer = memo<Props>(({apply, onChange, options, hasSelectedValues}) => {
    const allSelectedOptionsIds = useMemo<OptionId[]>(() => {
        return options.filter(({productIds}) => productIds.length > 0).map(({id}) => id);
    }, [options]);
    const deselectAll = useCallback(() => {
        onChange([]);
    }, [onChange]);
    const selectAll = useCallback(() => {
        onChange(allSelectedOptionsIds);
    }, [onChange, allSelectedOptionsIds]);

    return (
        <div className={`${buttonsLine} ${footerButtons}`}>
            <FooterActionButtons
                selectAll={selectAll}
                deselectAll={deselectAll}
                apply={apply}
                hasSelectedValues={hasSelectedValues}
            />
        </div>
    );
});

Footer.displayName = 'Footer';
export default Footer;
