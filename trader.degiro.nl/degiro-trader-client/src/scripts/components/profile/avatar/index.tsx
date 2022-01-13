import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {CurrentClientContext} from '../../app-component/app-context';
import {avatar, avatarIcon} from './avatar.css';

interface Props {
    className?: string;
}

const {useContext} = React;
const ProfileAvatar: React.FunctionComponent<Props> = ({className = ''}) => {
    const currentClient = useContext(CurrentClientContext);

    return (
        <span data-name="profileAvatar" title={currentClient.displayName} className={`${avatar} ${className}`}>
            <Icon type="profile" className={avatarIcon} />
        </span>
    );
};

export default React.memo(ProfileAvatar);
