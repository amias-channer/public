import * as React from 'react';
import {ProductInfo, Position} from 'frontend-core/dist/models/product';
import useElementSize from 'frontend-core/dist/hooks/use-element-size';
import useProductPosition from '../../../hooks/use-product-position';
import FloatControlsPanel from '../../float-controls-panel';
import {
    floatTradingButton,
    floatTradingButtonsGroup,
    floatTradingButtonsLayout,
    staticTradingButtonsLayout
} from './product-details-header.css';
import PositionDetails from './position-details';
import {PositionFields} from '../../portfolio/positions-table-columns';
import ProductTradingButtons from '../../product-trading-buttons';
import {largeButtonLayout, smallButtonLayout} from '../../product-trading-buttons/product-trading-buttons.css';

type Props = React.PropsWithChildren<{
    productInfo: ProductInfo;
    hasCompactView: boolean;
}>;

const {useRef, memo} = React;
const floatControlsProductTradingButtonsProps = {className: floatTradingButton};
const FloatControls = memo<Props>(({productInfo, hasCompactView}) => {
    const productTradingButtonsRef = useRef<HTMLDivElement>(null);
    const productTradingButtonsSize = useElementSize(productTradingButtonsRef);
    const isFullTextTradingButtons = productTradingButtonsSize
        ? // 225 is a minimal width for buttons with full text
          //     more that 225px |>   Koop/Verkoop
          //     less that 225px |>   K/V
          productTradingButtonsSize.width > 225
        : true;
    const position: Position | undefined = useProductPosition(productInfo);

    return (
        <FloatControlsPanel>
            {(hasStaticLayout: boolean) => (
                <div className={hasStaticLayout ? staticTradingButtonsLayout : floatTradingButtonsLayout}>
                    {position?.isActive && (
                        <PositionDetails
                            id={position.id}
                            currency={productInfo.currency}
                            price={position.valueInProductCurrency}
                            quantity={position[PositionFields.QUANTITY]}
                        />
                    )}
                    <ProductTradingButtons
                        ref={productTradingButtonsRef}
                        className={`
                            ${hasStaticLayout ? '' : floatTradingButtonsGroup}
                            ${hasStaticLayout && hasCompactView ? smallButtonLayout : largeButtonLayout}
                        `}
                        productInfo={productInfo}
                        buttonProps={hasStaticLayout ? undefined : floatControlsProductTradingButtonsProps}
                        fullText={hasStaticLayout ? !hasCompactView : isFullTextTradingButtons}
                    />
                </div>
            )}
        </FloatControlsPanel>
    );
});

FloatControls.displayName = 'FloatControls';
export default FloatControls;
