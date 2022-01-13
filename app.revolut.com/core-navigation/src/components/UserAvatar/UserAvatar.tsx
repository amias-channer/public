import { FC } from 'react'
import { AvatarCircle, AvatarCircleProps } from '@revolut/ui-kit'

import { useQueryUserPicture } from '../../hooks'
import { generateColorFromString, getFistLetter } from '../../utils'

type UserAvatarProps = {
  className?: string
  userId: string
  userName?: string
} & AvatarCircleProps

export const USER_AVATAR_TEST_ID = 'user-picture'

export const UserAvatar: FC<UserAvatarProps> = ({
  className,
  userId,
  userName = '',
  ...rest
}) => {
  const { data: userPicture } = useQueryUserPicture()

  return (
    <AvatarCircle
      className={className}
      image={userPicture}
      bg={generateColorFromString(userId)}
      overflow="hidden"
      variant="filled"
      data-testid={USER_AVATAR_TEST_ID}
      {...rest}
    >
      {!userPicture ? getFistLetter(userName) : null}
    </AvatarCircle>
  )
}
