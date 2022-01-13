import {ProductInfo} from 'frontend-core/dist/models/product';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import {NumberAbbrSize} from 'frontend-core/dist/utils/number/abbreviate-number';
import * as React from 'react';
import {line, lineTopSeparator} from '../../../../styles/details-overview.css';
import {
    CompanyRatios,
    RefinitivCompanyProfile,
    RefinitivCompanyRatios
} from '../../../models/refinitiv-company-profile';
import getRatiosFromCompanyRatiosAndProfile from '../../../services/refinitiv-company-ratios/get-ratios-from-company-ratios-and-profile';
import {
    defaultAmountFormatting,
    defaultPercentFormatting,
    fullViewLayoutNumberAbbrSizes,
    oneColumnLayoutNumberAbbrSizes
} from '../../product-details/formatting-config';
import Amount from '../../value/amount';
import NumberAbbr from '../../value/number-abbr';
import CardRowWithTooltip from '../card-row-with-tooltip';
import TooltipDescriptionLine from '../product-details-hint/tooltip-description-line/index';
import ratiosTooltips from '../tooltips-data/refinitiv-ratios-tooltips';
import {I18nContext} from '../../app-component/app-context';

interface Props {
    companyRatios?: RefinitivCompanyRatios;
    companyProfile?: RefinitivCompanyProfile;
    productInfo: ProductInfo;
    isFullView: boolean;
}

const {useMemo, useContext} = React;
const ProductCompanyRatios: React.FunctionComponent<Props> = ({
    companyRatios,
    companyProfile,
    isFullView,
    productInfo
}) => {
    const i18n = useContext(I18nContext);
    const ratiosData = useMemo<CompanyRatios>(() => {
        return companyRatios && companyProfile
            ? getRatiosFromCompanyRatiosAndProfile(companyRatios, companyProfile)
            : {};
    }, [companyRatios, companyProfile]);
    const {id: productId} = productInfo;
    const numberAbbrSizes: NumberAbbrSize[] = isFullView
        ? fullViewLayoutNumberAbbrSizes
        : oneColumnLayoutNumberAbbrSizes;
    const isPointerDevice = !isTouchDevice();

    return (
        <div>
            <dl>
                <div className={line}>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.entrprVolume')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.EV.title}
                                    content={ratiosTooltips.EV.content}
                                />
                            )
                        }>
                        <NumberAbbr value={ratiosData.EV} field="EV" id={productId} sizes={numberAbbrSizes} />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.prcToRevShrTtm')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.TTMREVPS.title}
                                    content={ratiosTooltips.TTMREVPS.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultAmountFormatting}
                            id={productId}
                            value={ratiosData.TTMREVPS}
                            field="TTMREVPS"
                        />
                    </CardRowWithTooltip>
                </div>
                <div className={line}>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.cmnShrHdrInc')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.TTMNIAC.title}
                                    content={ratiosTooltips.TTMNIAC.content}
                                />
                            )
                        }>
                        <NumberAbbr value={ratiosData.TTMNIAC} field="TTMNIAC" id={productId} sizes={numberAbbrSizes} />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.grsMarginTts')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.TTMGROSMGN.title}
                                    content={ratiosTooltips.TTMGROSMGN.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultPercentFormatting}
                            id={productId}
                            value={ratiosData.TTMGROSMGN}
                            field="TTMGROSMGN"
                        />
                    </CardRowWithTooltip>
                </div>
                <div className={line}>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.cfShr')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.TTMCFSHR.title}
                                    content={ratiosTooltips.TTMCFSHR.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultAmountFormatting}
                            value={ratiosData.TTMCFSHR}
                            field="TTMCFSHR"
                            id={productId}
                        />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.roePercentTtm')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.TTMROEPCT.title}
                                    content={ratiosTooltips.TTMROEPCT.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultPercentFormatting}
                            id={productId}
                            value={ratiosData.TTMROEPCT}
                            field="TTMROEPCT"
                        />
                    </CardRowWithTooltip>
                </div>
                <div className={line}>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.qtrBvShr')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.QBVPS.title}
                                    content={ratiosTooltips.QBVPS.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultAmountFormatting}
                            value={ratiosData.QBVPS}
                            field="QBVPS"
                            id={productId}
                        />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.priceToBvMrq')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.PRICE2BK.title}
                                    content={ratiosTooltips.PRICE2BK.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultAmountFormatting}
                            id={productId}
                            value={ratiosData.PRICE2BK}
                            field="PRICE2BK"
                        />
                    </CardRowWithTooltip>
                </div>
                <div className={line}>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.qtrCfShr')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.QCSHPS.title}
                                    content={ratiosTooltips.QCSHPS.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultAmountFormatting}
                            value={ratiosData.QCSHPS}
                            field="QCSHPS"
                            id={productId}
                        />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        label={localize(i18n, 'trader.productDetails.ratios.projPe')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={ratiosTooltips.ProjPE.title}
                                    content={ratiosTooltips.ProjPE.content}
                                />
                            )
                        }>
                        <Amount
                            formatting={defaultAmountFormatting}
                            id={productId}
                            value={ratiosData.ProjPE}
                            field="ProjPE"
                        />
                    </CardRowWithTooltip>
                </div>
                <CardRowWithTooltip
                    className={`${line} ${lineTopSeparator}`}
                    label={localize(i18n, 'trader.productDetails.ratios.projSales')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={ratiosTooltips.ProjSales.title}
                                content={ratiosTooltips.ProjSales.content}
                            />
                        )
                    }>
                    <NumberAbbr value={ratiosData.ProjSales} field="ProjSales" id={productId} sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    className={line}
                    label={localize(i18n, 'trader.productDetails.ratios.projInterimSales')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={ratiosTooltips.ProjSalesQ.title}
                                content={ratiosTooltips.ProjSalesQ.content}
                            />
                        )
                    }>
                    <NumberAbbr
                        value={ratiosData.ProjSalesQ}
                        field="ProjSalesQ"
                        id={productId}
                        sizes={numberAbbrSizes}
                    />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    className={line}
                    label={localize(i18n, 'trader.productDetails.ratios.projInterimEps')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={ratiosTooltips.ProjEPSQ.title}
                                content={ratiosTooltips.ProjEPSQ.content}
                            />
                        )
                    }>
                    <NumberAbbr value={ratiosData.ProjEPSQ} field="ProjEPSQ" id={productId} sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    className={line}
                    label={localize(i18n, 'trader.productDetails.ratios.projLongTermGrowthRate')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={ratiosTooltips.ProjLTGrowthRate.title}
                                content={ratiosTooltips.ProjLTGrowthRate.content}
                            />
                        )
                    }>
                    <Amount
                        formatting={defaultPercentFormatting}
                        value={ratiosData.ProjLTGrowthRate}
                        field="ProjLTGrowthRate"
                        id={productId}
                    />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    className={line}
                    label={localize(i18n, 'trader.productDetails.ratios.projProfit')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={ratiosTooltips.ProjProfit.title}
                                content={ratiosTooltips.ProjProfit.content}
                            />
                        )
                    }>
                    <NumberAbbr
                        value={ratiosData.ProjProfit}
                        field="ProjProfit"
                        id={productId}
                        sizes={numberAbbrSizes}
                    />
                </CardRowWithTooltip>
                <CardRowWithTooltip
                    className={line}
                    label={localize(i18n, 'trader.productDetails.ratios.projDivShr')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={ratiosTooltips.ProjDPS.title}
                                content={ratiosTooltips.ProjDPS.content}
                            />
                        )
                    }>
                    <NumberAbbr value={ratiosData.ProjDPS} field="ProjDPS" id={productId} sizes={numberAbbrSizes} />
                </CardRowWithTooltip>
            </dl>
        </div>
    );
};

export default React.memo(ProductCompanyRatios);
