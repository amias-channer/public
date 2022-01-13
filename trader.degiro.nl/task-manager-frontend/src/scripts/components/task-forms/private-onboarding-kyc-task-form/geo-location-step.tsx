import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import getGeolocationPosition from 'frontend-core/dist/platform/geolocation/get-geolocation-position';
import requestLocationAuthorization from 'frontend-core/dist/platform/geolocation/request-location-authorization';
import getDeviceInfo, {DeviceInfo} from 'frontend-core/dist/platform/get-device-info';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import geolocationConfirmedImgUrl from '../../../../images/svg/geolocation-confirmed.svg';
import {GeolocationCoordinates} from '../../../models/fourthline';
import {TaskStatusInformation} from '../../../models/private-onboarding-kyc-task';
import saveMetadataInformation from '../../../services/private-onboarding-kyc-task/save-metadata-information';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import useFormError from '../../task-form/hooks/use-form-error';
import TaskBackButton from '../../task-form/task-back-button';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';
import {onboardingKycStepImg} from './private-onboarding-kyc-task-form.css';

interface Props {
    task: Task;
    geolocation?: GeolocationCoordinates;
    onBack(): void;
    onSubmit(taskStatusInformation: TaskStatusInformation): void;
}

const {useContext, useEffect, useCallback, useState} = React;
const GeoLocationStep: React.FunctionComponent<Props> = ({
    task,
    onSubmit,
    onBack,
    geolocation: geolocationFromProp
}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const {taskType} = task;
    const i18nTranslationCode = `task.${taskType}.GEO_LOCATION_INSTRUCTION`;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        isLoading: isDeviceInfoLoading,
        value: deviceInfo = {locale: '', model: ''},
        error: deviceInfoError
    } = useAsync<DeviceInfo>(() => getDeviceInfo(), []);
    const {
        isLoading: isGeolocationLoading,
        value: geolocation = {latitude: 0, longitude: 0},
        error: geolocationError
    } = useAsync<GeolocationCoordinates>(() => {
        // if we already have geolocation data in props we don't need to make a request for GeolocationPosition
        if (geolocationFromProp && geolocationFromProp.latitude !== 0 && geolocationFromProp.longitude !== 0) {
            return Promise.resolve(geolocationFromProp);
        }

        return requestLocationAuthorization()
            .catch((error: Error | AppError) => {
                logErrorLocally(error);
                logErrorRemotely(error);
                throw new AppError({
                    text: localize(i18n, `${i18nTranslationCode}.errors.noLocationPermissions`)
                });
            })
            .then(() => getGeolocationPosition());
    }, [geolocationFromProp]);
    const [submissionError, setSubmissionError] = useState<Error | AppError | undefined>();
    const formError: AppError | undefined = useFormError(deviceInfoError || geolocationError || submissionError);
    const goToNextStep = useCallback(() => {
        const {latitude, longitude} = geolocation;
        const [deviceLanguage, deviceRegion] = deviceInfo.locale.split('_');
        const metadataInformation = {
            latitude,
            longitude,
            deviceLanguage,
            deviceRegion,
            deviceModel: deviceInfo.model
        };

        setIsSubmitting(true);
        setSubmissionError(undefined);

        saveMetadataInformation(config, task, metadataInformation)
            .then(onSubmit)
            .catch(setSubmissionError)
            .finally(() => setIsSubmitting(false));
    }, [onSubmit, deviceInfo, geolocation]);

    useEffect(() => {
        if (formError) {
            app.openErrorModal(formError);
        }
    }, [formError]);

    return (
        <div>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            {isSubmitting || isDeviceInfoLoading || isGeolocationLoading ? (
                <Spinner local={true} />
            ) : (
                <div data-name="geoLocationStep" className={taskFormStyles.form}>
                    <div className={gridStyles.row}>
                        <Cell size={12} align="center">
                            <img
                                src={geolocationConfirmedImgUrl}
                                width={168}
                                height={150}
                                className={onboardingKycStepImg}
                                alt=""
                            />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={12}>
                            <Separator />
                        </Cell>
                    </div>
                    <div className={gridStyles.row}>
                        <Cell size={12} className={taskFormStyles.formButtons}>
                            <TaskBackButton onClick={onBack} />
                            <Button type="button" className={taskFormStyles.formSubmitButton} onClick={goToNextStep}>
                                {localize(i18n, 'taskManager.task.goToNextStep')}
                            </Button>
                        </Cell>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(GeoLocationStep);
