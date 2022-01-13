import {DateParserOptions} from 'frontend-core/dist/utils/date/parse-date';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';

export const nbsp: string = '\xa0';

export const bullet: string = '\u2022';

/**
 * @description Use a non-breakable space to prevent a new line to start from a delimiter
 * @type {string}
 */
export const valuesDelimiter: string = `${nbsp}| `;

export const valuePlaceholder: string = '—';

export interface ValueProps<T> {
    id: number | string;
    value: undefined | null | T;
    field: string;
    className?: string;
    prefix?: React.ReactNode;
    children?: React.ReactNode;
}

export interface RootNodeProps {
    'data-id'?: number | string;
    'data-field'?: string;
    'data-positive'?: 'true';
    'data-negative'?: 'true';
    title?: string;
    className?: string;
}

export interface DateValueProps extends ValueProps<string | Date> {
    format?: string;
    timeFormat?: string;
    onlyTodayTime?: boolean;
    onlyTime?: boolean;
    parserOptions?: DateParserOptions;
}

export interface NumericValueProps extends ValueProps<number | string> {
    formatting?: NumberFormattingOptions;
    brackets?: boolean;
    highlightValueChange?: boolean;
    highlightValueBySign?: boolean;
    showPositiveSign?: boolean;
    marked?: boolean;
    emptyValueClassName?: string;
    neutralValueClassName?: string;
}

export type NumericValueSign = '' | '+' | '-';

export type RelativeTimeProps = Omit<ValueProps<Date>, 'children' | 'prefix'> & {
    value: Date | undefined;
    thresholdInDays?: number;
};
