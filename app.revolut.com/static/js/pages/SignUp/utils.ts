import { UserAuthFlowElement, UserAuthFlowElementDto } from '@revolut/rwa-core-types'

export const getUserAuthFlowElement = (
  data: ReadonlyArray<UserAuthFlowElementDto>,
): UserAuthFlowElement | undefined => data?.[0]?.element
