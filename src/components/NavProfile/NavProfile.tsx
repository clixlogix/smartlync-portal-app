/**
 *
 * NavProfile
 *
 */
import { memo } from 'react';
// import styled from 'styled-components/macro';
import { Images } from 'constants/index';
import { User } from 'models';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'utils';
// import { Menu, MenuOptionItem, MenuOption } from 'components/Menu';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { /* MenuOptionItem,*/ MenuOption } from 'components/MuiMenu';
import Constants from 'constants/index';

import { Typography } from '@mui/material';
import { messages } from './messages';

interface Props {
    className?: string;

    onMenu?(option: MenuOption);
}

export const NavProfile = memo((props: Props) => {
    const { t } = useTranslation();
    const [userInfo] = useLocalStorage<any>(Constants.storageKeys.userDetails);
    const { user = { profile: { profilePic: 'DefaultAvatar' } } } = userInfo;
    const { fullName, profile } = user as any;
    let { profilePic = 'DefaultAvatar' /*, designation */ } = profile || ({} as any);

    profilePic = !!profilePic ? profilePic : 'DefaultAvatar';

    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
            <Divider orientation="vertical" variant="middle" sx={{ height: 20 }} />
            <Typography>{fullName}</Typography>
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                <Avatar
                    alt={t(messages.userProfileAlt)}
                    src={Images.profilePic(profilePic.replace(/\.png$/i, ''))}
                    sx={{ width: 24, height: 24 }}
                />
            </Badge>
        </Stack>
    );
});

export default NavProfile;
