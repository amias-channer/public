import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import {MeasureItemDataValue} from '../../../../../models/analyst-views';

export default function getLineChartHeight(lineChartDataValues: MeasureItemDataValue[]): number {
    const hasDifferentValues: boolean = omitNullable(lineChartDataValues).some(
        (value, index) => index > 0 && value !== lineChartDataValues[index - 1]
    );

    return hasDifferentValues ? 18 : 5;
}
