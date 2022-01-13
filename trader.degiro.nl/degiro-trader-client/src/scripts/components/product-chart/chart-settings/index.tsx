import {formLineWithMultipleFields, halfWidthFieldLayout} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import findSelectedOption from 'frontend-core/dist/components/ui-trader4/select/find-selected-option';
import Select, {SelectOption} from 'frontend-core/dist/components/ui-trader4/select/index';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {filterOptionAllId} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {VwdChartTimeResolutionValue} from '../../../models/product-chart';
import {VwdChartPeriodValue, VwdChartTypes} from '../../../models/vwd-api';
import {stickyBottomPanel} from '../../app-component/app-component.css';
import {I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import canCompareProducts from '../can-compare-products';
import canSetChartType from '../can-set-chart-type';
import {ComparableProductsOption} from '../get-comparable-products-options';
import getTimeResolutionOptions from '../get-time-resolution-options';
import {form as formClassName, select as selectClassName, submitButton} from './chart-settings.css';

export interface ChartSettingsModel {
    period: VwdChartPeriodValue | undefined;
    resolution: VwdChartTimeResolutionValue | undefined;
    chartType: VwdChartTypes | undefined;
    comparableProduct: ProductInfo | undefined;
}

interface Props {
    comparableProductsOptions: ComparableProductsOption[];
    chartTypeSelectOptions: SelectOption[];
    periodSelectOptions: SelectOption[];
    values: ChartSettingsModel;
    onSave(settings: Readonly<ChartSettingsModel>): void;
}

const {useState, useEffect, useContext} = React;
const ChartSettings: React.FunctionComponent<Props> = ({
    values,
    periodSelectOptions,
    chartTypeSelectOptions,
    comparableProductsOptions,
    onSave
}) => {
    const i18n = useContext(I18nContext);
    const [formData, setFormData] = useState<ChartSettingsModel>({...values});
    const [timeResolutionOptions, setTimeResolutionOptions] = useState<SelectOption[]>([]);
    const canHaveComparableProduct = canCompareProducts(formData);
    const updateFormData = (field: keyof ChartSettingsModel, value: string | number | object | undefined) => {
        setFormData((formData) => ({...formData, [field]: value}));
    };
    const setTimeResolution = () => {
        const timeResolutionOptions = getTimeResolutionOptions(i18n, formData.period, formData.chartType);
        const selectedTimeResolutionOption = findSelectedOption(timeResolutionOptions, formData.resolution);

        setTimeResolutionOptions(timeResolutionOptions);

        if (!selectedTimeResolutionOption) {
            updateFormData('resolution', timeResolutionOptions[0]?.value);
        }
    };
    const setComparableProduct = (productInfo: ComparableProductsOption['value'] | undefined) => {
        updateFormData(
            'comparableProduct',
            String(productInfo) === String(filterOptionAllId) ? undefined : productInfo
        );
    };
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(formData);
    };

    useEffect(() => {
        setTimeResolution();
    }, []);

    useEffect(() => {
        /**
         * reset selected product because
         * 1. not all chart types allow to select comparable products
         * 2. if product is passed as selected via props it becomes harder to user to switch the chart type,
         *    he needs to deselect product (see point #1 above) and only then select chart type
         */
        setComparableProduct(undefined);
    }, [canHaveComparableProduct]);

    useEffect(() => {
        setTimeResolution();
    }, [formData.chartType, formData.period]);

    return (
        <form name="chartSettingsForm" onSubmit={onFormSubmit} className={formClassName}>
            <div className={formLineWithMultipleFields}>
                <span className={halfWidthFieldLayout}>{localize(i18n, 'trader.productChart.period')}</span>
                <div className={halfWidthFieldLayout}>
                    <Select
                        className={selectClassName}
                        name="chartPeriod"
                        options={periodSelectOptions}
                        selectedOption={findSelectedOption(periodSelectOptions, formData.period)}
                        onChange={updateFormData.bind(null, 'period')}
                    />
                </div>
            </div>
            {timeResolutionOptions.length > 0 && (
                <div className={formLineWithMultipleFields}>
                    <span className={halfWidthFieldLayout}>{localize(i18n, 'trader.productChart.interval')}</span>
                    <div className={halfWidthFieldLayout}>
                        <Select
                            className={selectClassName}
                            name="timeResolution"
                            options={timeResolutionOptions}
                            selectedOption={findSelectedOption(timeResolutionOptions, formData.resolution)}
                            onChange={updateFormData.bind(null, 'resolution')}
                        />
                    </div>
                </div>
            )}
            <div className={formLineWithMultipleFields}>
                <span className={halfWidthFieldLayout}>{localize(i18n, 'trader.productChart.chartType')}</span>
                <div className={halfWidthFieldLayout}>
                    <Select
                        className={selectClassName}
                        name="chartType"
                        disabled={!canSetChartType(formData)}
                        options={chartTypeSelectOptions}
                        selectedOption={findSelectedOption(chartTypeSelectOptions, formData.chartType)}
                        onChange={updateFormData.bind(null, 'chartType')}
                    />
                </div>
            </div>
            {comparableProductsOptions.length > 0 && (
                <div className={formLineWithMultipleFields}>
                    <span className={halfWidthFieldLayout}>{localize(i18n, 'trader.productChart.compareWith')}</span>
                    <div className={halfWidthFieldLayout}>
                        <Select
                            className={selectClassName}
                            name="comparableProduct"
                            disabled={!canHaveComparableProduct}
                            options={comparableProductsOptions}
                            selectedOption={findSelectedOption(comparableProductsOptions, formData.comparableProduct)}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={setComparableProduct}
                        />
                    </div>
                </div>
            )}
            <Button type="submit" variant={ButtonVariants.ACCENT} className={`${stickyBottomPanel} ${submitButton}`}>
                {localize(i18n, 'trader.filtersList.saveAction')}
            </Button>
        </form>
    );
};

export default React.memo(ChartSettings);
