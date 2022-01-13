import { User } from '@revolut/rwa-core-types'

export const getFullName = (user: User) => `${user.firstName} ${user.lastName}`
