import {User} from 'frontend-core/dist/models/user';
import getClientInfo from 'frontend-core/dist/services/user/get-client-info';
import getClientSettings from 'frontend-core/dist/services/user/get-client-settings';
import {AppParams} from '../../models/app-params';
import {Config} from '../../models/config';

export default async function getMainClient(config: Config, appParams: AppParams): Promise<User> {
    const {intAccount} = appParams;
    let mainClientOptions: undefined | {intAccount: number};

    if (intAccount) {
        mainClientOptions = {intAccount: Number(intAccount)};
    }
    const mainClient: User = await getClientInfo(config, mainClientOptions);

    mainClient.settings = await getClientSettings(config, {intAccount: mainClient.intAccount as number});
    return mainClient;
}
