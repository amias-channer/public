export const TIMING = ['0.15', '0.5', '0.5', '1']

export const INTERVALS = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
}

export const INTERVALS_MAP = {
  sm: 200,
  md: 300,
  lg: 450,
}

export const TRANSITIONS = {
  [INTERVALS.SM]: `${INTERVALS_MAP.sm}ms cubic-bezier(${TIMING})`,
  [INTERVALS.MD]: `${INTERVALS_MAP.md}ms cubic-bezier(${TIMING})`,
  [INTERVALS.LG]: `${INTERVALS_MAP.lg}ms cubic-bezier(${TIMING})`,
}

export const transition = (interval = INTERVALS.MD) => TRANSITIONS[interval]
transition.INTERVALS = INTERVALS
