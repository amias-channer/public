import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {VwdModule} from 'frontend-core/dist/models/vwd-settings';
import localize from 'frontend-core/dist/services/i18n/localize';
import getVwdModules from 'frontend-core/dist/services/vwd-settings/get-vwd-modules';
import isVwdModuleSwitchable from 'frontend-core/dist/services/vwd-settings/is-vwd-module-switchable';
import toggleVwdModuleStatus from 'frontend-core/dist/services/vwd-settings/toggle-vwd-module-status';
import createLocaleComparator from 'frontend-core/dist/utils/collection/create-locale-comparator';
import * as React from 'react';
import {AppApiContext, ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import {contentHorizontalMargin} from '../card/card.css';
import CardHeader from '../card/header';
import ExternalHtmlContent from '../external-html-content/index';
import {item, list, primaryContent, secondaryContent, underlinedItem} from '../list/list.css';
import Switch from '../switch/index';
import useSettingsModules from './hooks/use-settings-modules';
import {settingsDescription, settingsItemLabel} from './settings.css';

interface IndexedModule {
    index: number;
    label: string;
}

const {useContext, memo} = React;
const RealTimePricesSettings = memo(() => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {modules, processModuleSwitch} = useSettingsModules<VwdModule>(() => {
        return getVwdModules(config, {}).then((modules: VwdModule[]) => {
            const switchableVwdModules: VwdModule[] = modules.filter(isVwdModuleSwitchable.bind(null, currentClient));

            return switchableVwdModules
                .map(({translation}: VwdModule, index: number) => ({index, label: localize(i18n, translation)}))
                .sort(createLocaleComparator(currentClient.locale, (module: IndexedModule) => module.label))
                .map((module: IndexedModule) => switchableVwdModules[module.index]);
        });
    });
    const onModuleSwitchClick = (vwdModule: VwdModule) => {
        app.openModal({
            title: localize(i18n, 'trader.settings.switchConfirmation.title'),
            content: localize(
                i18n,
                vwdModule.enabled
                    ? 'trader.settings.switchConfirmation.switchOff.description'
                    : 'trader.settings.switchConfirmation.switchOn.description',
                {
                    module: localize(i18n, vwdModule.translation)
                }
            ),
            onConfirm: () => processModuleSwitch(vwdModule, toggleVwdModuleStatus(config, vwdModule))
        });
    };
    const pageTitle: string = localize(i18n, 'trader.navigation.settings.realTimePrices');

    useDocumentTitle(pageTitle);

    return (
        <Card
            data-name="realTimePrices"
            innerHorizontalGap={false}
            header={<CardHeader title={pageTitle} />}
            footer={true}>
            <ExternalHtmlContent className={`${contentHorizontalMargin} ${settingsDescription}`}>
                {localize(i18n, 'trader.realTimePricesSettings.description')}
            </ExternalHtmlContent>
            <ul className={list}>
                {modules.map((settingsModule: VwdModule) => (
                    <li key={String(settingsModule.id)} className={`${item} ${underlinedItem}`}>
                        <div className={`${primaryContent} ${settingsItemLabel}`}>
                            {localize(i18n, settingsModule.translation)}
                        </div>
                        <div className={secondaryContent}>
                            <Switch
                                protected={true}
                                inTransition={settingsModule.inTransition}
                                disabled={!settingsModule.switchable}
                                checked={settingsModule.enabled}
                                onChange={onModuleSwitchClick.bind(null, settingsModule)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
});

RealTimePricesSettings.displayName = 'RealTimePricesSettings';
export default RealTimePricesSettings;
