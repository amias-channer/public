import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {page, pageTitle} from 'frontend-core/dist/components/ui-onboarding/page.css';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {UserAccountPerson} from 'frontend-core/dist/models/user';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {form} from '../form/form.css';
import {
    persons as personsClassName,
    personsDescription,
    personsItem,
    personsItemButton
} from './user-account-person-verification.css';

interface Props {
    persons: UserAccountPerson[];
    onPersonSelect(userAccountPerson: UserAccountPerson): void;
}

const {useEffect, useContext} = React;
const UserAccountPersonVerification: React.FunctionComponent<Props> = ({persons, onPersonSelect}) => {
    const i18n = useContext(I18nContext);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/joint-contact-verification'});
    }, []);

    return (
        <div className={page}>
            <h2 className={pageTitle}>{localize(i18n, 'login.userContactVerification.title')}</h2>
            <div className={form}>
                <ul data-name="userAccountPersonVerification" className={personsClassName}>
                    {persons.map((person: UserAccountPerson) => {
                        const id: string = String(person.id);

                        return (
                            <li key={id} className={personsItem}>
                                <Button
                                    name="userAccountPerson"
                                    data-id={id}
                                    className={personsItemButton}
                                    onClick={onPersonSelect.bind(null, person)}>
                                    {person.name}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
                <InnerHtml className={personsDescription}>
                    {localize(i18n, 'login.userContactVerification.description')}
                </InnerHtml>
            </div>
        </div>
    );
};

export default React.memo(UserAccountPersonVerification);
