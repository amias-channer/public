import {AppError} from 'frontend-core/dist/models/app-error';
import {UserAccountPerson} from 'frontend-core/dist/models/user';
import isJointAccountPersonNeededError from 'frontend-core/dist/services/app-error/is-joint-account-person-needed-error';

export default function useJointAccountErrorPersons(error: Error | AppError | undefined): UserAccountPerson[] {
    return error && isJointAccountPersonNeededError(error) ? error.persons : [];
}
