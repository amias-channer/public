import {ModalApi} from 'frontend-core/dist/components/ui-trader3/modal';
import Modal, {ModalErrorHandler, ModalProps} from 'frontend-core/dist/components/ui-trader3/modal/index';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner/index';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {setRemoteLoggerUser} from 'frontend-core/dist/loggers/remote-logger';
import {AppError, ErrorCodes, WaitingListError} from 'frontend-core/dist/models/app-error';
import {Country, Nationality} from 'frontend-core/dist/models/country';
import {I18n, I18nModules} from 'frontend-core/dist/models/i18n';
import {Task as TaskModel, TasksInfo} from 'frontend-core/dist/models/task/task';
import {User} from 'frontend-core/dist/models/user';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import getAllCountries from 'frontend-core/dist/services/country/get-all-countries';
import getAllNationalities from 'frontend-core/dist/services/country/get-all-nationalities';
import getI18n from 'frontend-core/dist/services/i18n/get-i18n';
import isPrivateOnboardingInformationTask from 'frontend-core/dist/services/task/is-private-onboarding-information-task';
import parseUrl from 'frontend-core/dist/utils/url/parse-url';
import * as React from 'react';
import {Redirect, Route, Switch, useHistory, useLocation} from 'react-router-dom';
import {layoutContent} from '../../../styles/index.css';
import {AppParams} from '../../models/app-params';
import {Config} from '../../models/config';
import {TasksProgressInformation} from '../../models/tasks-progress';
import {Routes} from '../../navigation';
import getTasksProgress from '../../services/task/get-tasks-progress';
import getOpenedTasksInfo from '../../services/task/get-opened-tasks-info';
import getMainClient from '../../services/user/get-main-client';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import Header from '../header/index';
import Icon from '../icon/index';
import Task from '../task/index';
import TasksProgress from '../tasks-progress';
import Tasks from '../tasks/index';
import WaitingList from '../waiting-list';
import AddressConfirmation from './address-confirmation';
import {
    AppApiContext,
    AppParamsContext,
    ConfigContext,
    CountriesContext,
    CurrentClientContext,
    I18nContext,
    MainClientContext,
    NationalitiesContext,
    TasksInfoContext
} from './app-context';

export interface RedirectOptions {
    replace?: boolean;
}

export type RedirectHandler = (path: string, options?: RedirectOptions) => void;
export type ModalOpenHandler = (props: ModalProps) => void;
export type ModalCloseHandler = () => void;
export type FinishTaskHandler = (task: TaskModel) => Promise<void>;

export interface AppComponentApi {
    openModal: ModalOpenHandler;
    closeModal: ModalCloseHandler;
    openErrorModal: ModalErrorHandler;
    scrollPageToTop(): void;
    onFinishTask: FinishTaskHandler;
}

interface Props {
    config: Config;
}

const {useEffect, useState, useMemo, useRef, useCallback} = React;
const AppComponent: React.FunctionComponent<Props> = ({config: configFromProp}) => {
    const location = useLocation();
    const history = useHistory();
    const layoutContentRef = useRef<HTMLElement | null>(null);
    const modalApiRef = useRef<ModalApi | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [waitingListError, setWaitingListError] = useState<WaitingListError | undefined>();
    const [i18n, setI18n] = useState<I18n>({});
    const [countries, setCountries] = useState<Country[]>([]);
    const [nationalities, setNationalities] = useState<Nationality[]>([]);
    const [tasksInfo, setTasksInfo] = useState<TasksInfo>({tasks: [], hasOverdueTask: false});
    const [currentClient, setCurrentClient] = useState<User>({} as User);
    const [mainClient, setMainClient] = useState<User>({} as User);
    const [tasksProgressInformation, setTasksProgressInformation] = useState<TasksProgressInformation>({
        tasks: [],
        currentTask: undefined
    });
    const [config] = useStateFromProp<Config>(configFromProp);
    const appParams: AppParams = useMemo(() => parseUrl(window.location.href).query, [window.location.href]);
    const onModalApi = useCallback((modalApi: ModalApi) => (modalApiRef.current = modalApi), []);
    const loadMainClient = async (): Promise<User> => {
        const mainClient: User = await getMainClient(config, appParams);

        trackAnalytics.init(mainClient, mainClient);
        setMainClient(mainClient);
        setCurrentClient(mainClient);

        return mainClient;
    };
    const loadTasksInfo = (): Promise<void> => getOpenedTasksInfo(config).then(setTasksInfo);
    const onFinishTask = (appApi: AppComponentApi, task: TaskModel): Promise<void> => {
        // We don't set isLoading state because we need to keep child component's state and context
        return Promise.all<void, boolean | User>([
            loadTasksInfo(),
            // [WF-2067] We should reload a global client model after updating the personal information
            isPrivateOnboardingInformationTask(task) && loadMainClient()
        ])
            .then(() => undefined)
            .catch((error: Error | AppError) => {
                logErrorLocally(error);
                appApi.openErrorModal(error);
            });
    };
    const appApiRef: React.MutableRefObject<AppComponentApi> = useRef<AppComponentApi>({
        openModal: (props: ModalProps) => modalApiRef.current?.open(props),
        closeModal: () => modalApiRef.current?.close(),
        openErrorModal: (error: Error, props?: ModalProps) => {
            modalApiRef.current?.openErrorModal(error, {
                icon: <Icon type="exclamation_solid" scale={2} />,
                ...props
            });
        },
        scrollPageToTop: () => {
            const {current: layoutContent} = layoutContentRef;

            if (layoutContent) {
                layoutContent.scrollTop = 0;
            }
        },
        onFinishTask: (task: TaskModel) => onFinishTask(appApiRef.current, task)
    });
    const {currentTask} = tasksProgressInformation;

    useEffect(() => {
        const {current: appApi} = appApiRef;

        // [WF-521], scroll content to top after navigation
        appApi.scrollPageToTop();

        // [WF-1104], close all modal windows during the navigation
        appApi.closeModal();
    }, [location.pathname]);

    useEffect(() => {
        loadMainClient()
            .then((mainClient: User) => {
                setRemoteLoggerUser({id: mainClient.id});

                const {language, culture: country} = mainClient;

                document.documentElement.lang = language;

                return getI18n(config, {
                    language,
                    country,
                    modules: [I18nModules.COMMON, I18nModules.TASK_MANAGER]
                });
            })
            .then((i18n: I18n) => {
                setI18n(i18n);

                return Promise.all([
                    getAllCountries(mainClient, i18n).then(setCountries),
                    getAllNationalities(mainClient, i18n).then(setNationalities),
                    loadTasksInfo()
                ]);
            })
            .catch((error: Error | AppError) => {
                if (isAppError(error) && error.code === ErrorCodes.CLIENT_IN_WAITING_LIST) {
                    setWaitingListError(error as WaitingListError);
                } else {
                    logErrorLocally(error);
                    appApiRef.current.openErrorModal(error);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        // [CLM-3351] if the client has current task in OnboardingKyc then we should immediately redirect to this task
        if (currentTask) {
            const task = tasksInfo.tasks.find((task: TaskModel) => task.taskType === currentTask);

            history.replace(`${Routes.TASKS}/${task?.taskId}`);
        }
    }, [currentTask, tasksInfo, history]);

    useEffect(() => {
        getTasksProgress(config).then(setTasksProgressInformation).catch(logErrorLocally);
        // Every time after updating the list of tasks, we need to update the task progress information
    }, [config, tasksInfo]);

    if (isLoading) {
        return (
            <div className={gridStyles.row}>
                <Cell size={12} align="center">
                    <Spinner local={true} />
                </Cell>
            </div>
        );
    }

    return (
        <AppApiContext.Provider value={appApiRef.current}>
            <AppParamsContext.Provider value={appParams}>
                <ConfigContext.Provider value={config}>
                    <I18nContext.Provider value={i18n}>
                        <MainClientContext.Provider value={mainClient}>
                            <CurrentClientContext.Provider value={currentClient}>
                                <CountriesContext.Provider value={countries}>
                                    <NationalitiesContext.Provider value={nationalities}>
                                        <TasksInfoContext.Provider value={tasksInfo}>
                                            <Header tasksProgressInformation={tasksProgressInformation} />
                                            <TasksProgress tasksProgressInformation={tasksProgressInformation} />
                                            <AddressConfirmation />
                                            <main ref={layoutContentRef} className={layoutContent}>
                                                {waitingListError ? (
                                                    <div className={gridStyles.row}>
                                                        <Cell size={12}>
                                                            <WaitingList error={waitingListError} />
                                                        </Cell>
                                                    </div>
                                                ) : (
                                                    <Switch>
                                                        <Route path={Routes.TASKS} exact={true}>
                                                            <Tasks />
                                                        </Route>
                                                        <Route path={`${Routes.TASKS}/:taskId`}>
                                                            <Task />
                                                        </Route>
                                                        {/*
                                                            We should prevent double redirects see line 183
                                                        */}
                                                        {!currentTask && <Redirect from="*" to={Routes.DEFAULT} />}
                                                    </Switch>
                                                )}
                                            </main>
                                            <Modal i18n={i18n} onApi={onModalApi} />
                                        </TasksInfoContext.Provider>
                                    </NationalitiesContext.Provider>
                                </CountriesContext.Provider>
                            </CurrentClientContext.Provider>
                        </MainClientContext.Provider>
                    </I18nContext.Provider>
                </ConfigContext.Provider>
            </AppParamsContext.Provider>
        </AppApiContext.Provider>
    );
};

export default React.memo(AppComponent);
