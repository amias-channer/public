import {ProductInfo} from 'frontend-core/dist/models/product';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import {NumberAbbrSize} from 'frontend-core/dist/utils/number/abbreviate-number';
import * as React from 'react';
import {line} from '../../../../styles/details-overview.css';
import {KeyFigures, RefinitivCompanyRatios} from '../../../models/refinitiv-company-profile';
import keyFiguresTooltips from '../tooltips-data/refinitiv-key-figures-tooltips';
import getKeyFiguresFromCompanyRatios from '../../../services/refinitiv-company-profile/get-key-figures-from-company-ratios';
import CardRowWithTooltip from '../../product-details/card-row-with-tooltip/index';
import NumberAbbr from '../../value/number-abbr';
import {fullViewLayoutNumberAbbrSizes, oneColumnLayoutNumberAbbrSizes} from '../formatting-config';
import TooltipDescriptionLine from '../product-details-hint/tooltip-description-line';
import {I18nContext} from '../../app-component/app-context';

const {useMemo} = React;

interface Props {
    companyRatios?: RefinitivCompanyRatios;
    productInfo: ProductInfo;
    isFullView: boolean;
}

const {useContext} = React;
const ProductKeyFigures: React.FunctionComponent<Props> = ({
    companyRatios,
    isFullView,
    productInfo: {id: productId}
}) => {
    const i18n = useContext(I18nContext);
    const keyFigures = useMemo<KeyFigures>(() => (companyRatios ? getKeyFiguresFromCompanyRatios(companyRatios) : {}), [
        companyRatios
    ]);
    const numberAbbrSizes: NumberAbbrSize[] = isFullView
        ? fullViewLayoutNumberAbbrSizes
        : oneColumnLayoutNumberAbbrSizes;
    const isPointerDevice = !isTouchDevice();

    return (
        <dl>
            <div className={line}>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.marketCap')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.MKTCAP.title}
                                content={keyFiguresTooltips.MKTCAP.content}
                            />
                        )
                    }>
                    <NumberAbbr id={productId} value={keyFigures.MKTCAP} field="MKTCAP" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.peExcXorItms')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.PEEXCLXOR.title}
                                content={keyFiguresTooltips.PEEXCLXOR.content}
                            />
                        )
                    }>
                    <NumberAbbr id={productId} value={keyFigures.PEEXCLXOR} field="PEEXCLXOR" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
            </div>
            <div className={line}>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.revenueTtm')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.TTMREV.title}
                                content={keyFiguresTooltips.TTMREV.content}
                            />
                        )
                    }>
                    <NumberAbbr id={productId} value={keyFigures.TTMREV} field="TTMREV" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.targetPrice')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.TargetPrice.title}
                                content={keyFiguresTooltips.TargetPrice.content}
                            />
                        )
                    }>
                    <NumberAbbr
                        id={productId}
                        value={keyFigures.TargetPrice}
                        field="TargetPrice"
                        sizes={numberAbbrSizes}
                    />
                </CardRowWithTooltip>
            </div>
            <div className={line}>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.ebitdaTtm')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.TTMEBITD.title}
                                content={keyFiguresTooltips.TTMEBITD.content}
                            />
                        )
                    }>
                    <NumberAbbr id={productId} value={keyFigures.TTMEBITD} field="TTMEBITD" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.projEps')}
                    tooltip={isPointerDevice && <TooltipDescriptionLine title={keyFiguresTooltips.ProjEPS.title} />}>
                    <NumberAbbr id={productId} value={keyFigures.ProjEPS} field="ProjEPS" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
            </div>
            <div className={line}>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.revShrTtm')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.TTMNIAC.title}
                                content={keyFiguresTooltips.TTMNIAC.content}
                            />
                        )
                    }>
                    <NumberAbbr id={productId} value={keyFigures.TTMREVPS} field="TTMREVPS" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    label={localize(i18n, 'trader.productDetails.ratios.divShrTtm')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={keyFiguresTooltips.TTMDIVSHR.title}
                                content={keyFiguresTooltips.TTMDIVSHR.content}
                            />
                        )
                    }>
                    <NumberAbbr id={productId} value={keyFigures.TTMDIVSHR} field="TTMDIVSHR" sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
            </div>
        </dl>
    );
};

export default React.memo(ProductKeyFigures);
