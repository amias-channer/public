import * as React from 'react';
import {chartLegendItem, chartLegendItemPoint} from './chart-legend.css';

export interface LegendItem {
    name: string;
    color: string;
}

interface Props {
    legend: LegendItem[];
    className?: string;
}

const ChartLegend: React.FunctionComponent<Props> = ({legend, className = ''}) => (
    <div className={className}>
        {legend.map((item) => (
            <div className={chartLegendItem} key={item.name}>
                {/* eslint-disable react/forbid-dom-props */}
                <div className={chartLegendItemPoint} style={{backgroundColor: item.color}} />
                {item.name}
            </div>
        ))}
    </div>
);

export default React.memo(ChartLegend);
