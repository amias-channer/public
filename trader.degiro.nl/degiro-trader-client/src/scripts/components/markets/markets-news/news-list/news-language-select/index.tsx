import {SelectOption, SelectSizes} from 'frontend-core/dist/components/ui-trader4/select';
import MultiSelect, {MultiSelectApi} from 'frontend-core/dist/components/ui-trader4/select/multiple';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {NewsLanguage} from '../../../../../models/news';
import {I18nContext} from '../../../../app-component/app-context';
import CountryFlag from '../../../../country-flag';
import FooterActionButtons from '../../filters/footer-actions-buttons';
import {newsLanguageFlag, newsLanguageFlagContainer, newsLanguageSelect} from './news-language-select.css';

interface Props {
    languages: ReadonlyArray<NewsLanguage>;
    defaultLanguageCode: string;
    enabledLanguageCodes: string[];
    hasOneColumnLayout?: boolean;
    onChange(languageCodes: string[]): void;
}

const {useCallback, useContext} = React;
const NewsLanguageSelect: React.FunctionComponent<Props> = ({
    hasOneColumnLayout,
    enabledLanguageCodes,
    defaultLanguageCode,
    languages,
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const onLanguagesSelect = useCallback(
        (languageCodes: string[]) => {
            onChange(languageCodes.length === 0 ? [defaultLanguageCode] : languageCodes);
        },
        [defaultLanguageCode]
    );
    const selectedLanguagesLabels: React.ReactNode[] = [];
    const options: SelectOption[] = [];
    const selectedOptions: SelectOption[] = [];
    const footer = useCallback(
        (multiSelectFooterApi: MultiSelectApi) => <FooterActionButtons {...multiSelectFooterApi} />,
        []
    );

    languages.forEach((language: NewsLanguage) => {
        const {code} = language;
        const upperCasedCode: string = code.toUpperCase();
        const option: SelectOption = {
            value: code,
            label: upperCasedCode
        };
        const countryFlagNode: React.ReactNode = (
            <CountryFlag country={language.countryCode} className={newsLanguageFlag} />
        );

        if (enabledLanguageCodes.includes(code)) {
            selectedLanguagesLabels.push(
                <span key={code} className={newsLanguageFlagContainer}>
                    {countryFlagNode}
                    {upperCasedCode}
                </span>
            );
            selectedOptions.push(option);
        }

        options.push({
            ...option,
            nativeElementLabel: language.label,
            preLabel: countryFlagNode
        });
    });

    const selectedLanguagesCount: number = selectedOptions.length;

    return (
        <MultiSelect
            className={hasOneColumnLayout ? undefined : newsLanguageSelect}
            size={SelectSizes.SMALL}
            label={
                selectedLanguagesCount < 4
                    ? selectedLanguagesLabels
                    : `${selectedLanguagesCount} ${localize(i18n, 'trader.markets.news.selected')}`
            }
            searchable={false}
            options={options}
            selectedOptions={selectedOptions}
            onChange={onLanguagesSelect}
            footer={footer}
        />
    );
};

export default React.memo(NewsLanguageSelect);
