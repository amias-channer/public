import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Country} from 'frontend-core/dist/models/country';
import {Task} from 'frontend-core/dist/models/task/task';
import * as React from 'react';
import Select from 'frontend-core/dist/components/ui-trader3/select';
import localize from 'frontend-core/dist/services/i18n/localize';
import idCardImgUrl from '../../../../images/svg/id-card.svg';
import paperIdImgUrl from '../../../../images/svg/paper-id.svg';
import passportImgUrl from '../../../../images/svg/passport.svg';
import {
    CountryInformation,
    DocumentTypeInformation,
    EligibleIdDocumentTypes
} from '../../../models/private-onboarding-kyc-task';
import getDocumentType from '../../../services/private-onboarding-kyc-task/get-document-type';
import getEligibleIdDocumentTypes from '../../../services/private-onboarding-kyc-task/get-eligible-id-document-types';
import {AppApiContext, ConfigContext, I18nContext, CurrentClientContext} from '../../app-component/app-context';
import Separator from '../../separator';
import getCountries from '../../../services/private-onboarding-kyc-task/get-countries';
import * as gridStyles from '../../grid/grid.css';
import Cell from '../../grid/cell';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import useCountryValues from '../../task-form/hooks/use-country-values';
import TaskTitle from '../../task-form/task-title';
import {
    documentSelectButton,
    documentSelectButtonContent,
    documentSelectButtonImg
} from './scan-document-step/scan-document-step.css';

const eligibleIdDocumentImageMap: Record<EligibleIdDocumentTypes, string> = {
    [EligibleIdDocumentTypes.ID_CARD]: idCardImgUrl,
    [EligibleIdDocumentTypes.ID_PASSPORT]: passportImgUrl,
    [EligibleIdDocumentTypes.ID_CARD_PAPER]: paperIdImgUrl
};

interface Props {
    task: Task;
    onBack(): void;
    onSubmit(documentTypeInformation: DocumentTypeInformation, countryInformation: CountryInformation): void;
}

const {useContext, useEffect, useState, useCallback} = React;
const IdUploadStep: React.FunctionComponent<Props> = ({task, onSubmit, onBack}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const currentClient = useContext(CurrentClientContext);
    const {taskType} = task;
    const i18nScanDocumentTranslationCode = `task.${task.taskType}.SCAN_DOCUMENT`;
    const i18nInformationTranslationCode = `task.${taskType}.INFORMATION`;
    const i18nTranslationCode = `task.${taskType}.COUNTRY`;
    const [country, setCountry] = useState<string | undefined>();
    const {isLoading, value: countries = [], error: countriesError} = useAsync<Country[]>(
        () => getCountries(config, i18n, currentClient),
        [config, i18n, currentClient]
    );
    const {
        isLoading: isEligibleIdDocumentTypesLoading,
        value: eligibleIdDocumentTypes = [],
        error: eligibleIdDocumentTypesError
    } = useAsync<EligibleIdDocumentTypes[]>(() => {
        if (!country) {
            return Promise.resolve([]);
        }
        return getEligibleIdDocumentTypes(config, {country});
    }, [config, country]);
    const onChangeCountry = useCallback(
        (event: React.FormEvent<HTMLSelectElement>) => {
            setCountry(event.currentTarget.value);
        },
        [setCountry]
    );
    const error: AppError | undefined = useFormError(countriesError || eligibleIdDocumentTypesError);
    const countryValues = useCountryValues(countries);
    const onSelectDocumentType = (eligibleIdDocumentType: EligibleIdDocumentTypes) => {
        const documentType = getDocumentType(eligibleIdDocumentType);

        onSubmit({documentType}, {country: country!});
    };

    useEffect(() => {
        if (error) {
            app.openErrorModal(error);
        }
    }, [error]);

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nInformationTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nInformationTranslationCode}.description`} />
            {isLoading || isEligibleIdDocumentTypesLoading ? (
                <Spinner local={true} />
            ) : (
                <div data-name="idUploadStep">
                    <div className={gridStyles.row}>
                        <Cell size={12}>
                            <strong>{localize(i18n, `${i18nTranslationCode}.title`)}</strong>
                        </Cell>
                        <Cell size={12}>{localize(i18n, `${i18nTranslationCode}.description`)}</Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={9} smallSize={4} mediumSize={6}>
                            <Select
                                name="country"
                                required={true}
                                label={localize(i18n, `task.${taskType}.COUNTRY.countryLabel`)}
                                value={country}
                                values={countryValues}
                                onChange={onChangeCountry}
                            />
                        </Cell>
                    </div>
                    {country && (
                        <>
                            <div className={gridStyles.row}>
                                <Cell size={12}>
                                    <strong>{localize(i18n, `${i18nScanDocumentTranslationCode}.title`)}</strong>
                                </Cell>
                            </div>
                            <div className={gridStyles.row}>
                                {eligibleIdDocumentTypes.map((documentType: EligibleIdDocumentTypes) => (
                                    <Cell size={12} key={documentType}>
                                        <Button
                                            data-name={documentType}
                                            className={documentSelectButton}
                                            onClick={onSelectDocumentType.bind(this, documentType)}>
                                            <div className={documentSelectButtonContent}>
                                                <img
                                                    src={eligibleIdDocumentImageMap[documentType]}
                                                    width={40}
                                                    height={40}
                                                    className={documentSelectButtonImg}
                                                    alt=""
                                                />
                                                {localize(
                                                    i18n,
                                                    `${i18nScanDocumentTranslationCode}.documentType.${documentType}`
                                                )}
                                            </div>
                                        </Button>
                                    </Cell>
                                ))}
                            </div>
                        </>
                    )}
                    <div className={gridStyles.row}>
                        <Cell size={12}>
                            <Separator />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={12} className={taskFormStyles.formButtons}>
                            <TaskBackButton onClick={onBack} />
                        </Cell>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(IdUploadStep);
