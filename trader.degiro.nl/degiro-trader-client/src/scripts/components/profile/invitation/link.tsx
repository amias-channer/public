import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {Routes} from '../../../navigation';
import canInviteFriends from '../../../services/invitation/can-invite-friends';
import {MainClientContext} from '../../app-component/app-context';

type Props = Omit<LinkProps, 'to'>;

const {useContext} = React;
const InvitationLink: React.FunctionComponent<Props> = (props) => {
    const mainClient = useContext(MainClientContext);

    return canInviteFriends(mainClient) ? <Link data-name="inviteFriendLink" {...props} to={Routes.INVITE} /> : null;
};

export default React.memo(InvitationLink);
