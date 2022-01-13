import {BankAccountInfo} from 'frontend-core/dist/models/bank';
import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function saveBankAccountStepData(
    config: Config,
    task: Task,
    bankAccount: Partial<BankAccountInfo>
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/bank-account`,
        method: 'PUT',
        body: {
            iban: bankAccount.iban,
            number: bankAccount.number,
            sortCode: bankAccount.sortCode
        }
    });
}
