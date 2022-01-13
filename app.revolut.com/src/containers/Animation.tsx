import * as React from 'react'
import * as R from 'ramda'
import { Box } from '@revolut/ui-kit'
import { Route, Switch } from 'react-router'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styled from 'styled-components'

import { usePrevious } from '../helpers/hooks'
import { FullHeightPages } from '../constants/routerPaths'

const Pages = {
  HELP: 'help',
  CHAT: 'chat',
  CHAT_LIST: 'chatList',
  NEW_CHAT: 'newChat',
  FORM: 'form',
}

const SlideAnimation = {
  LEFT: 'slideLeft',
  RIGHT: 'slideRight',
}

const getAnimation = R.when(
  R.complement(R.isNil),
  R.cond([
    [R.test(/^\/help$/), R.always(Pages.HELP)],
    [R.test(/^\/chat$/), R.always(Pages.CHAT_LIST)],
    [R.test(/^\/chat\/.+$/), R.always(Pages.CHAT)],
    [R.test(/^\/chat\/new$/), R.always(Pages.NEW_CHAT)],
    [R.test(/^\/form\/.+$/), R.always(Pages.FORM)],
    [R.test(/^\/surveyCompleted$/), R.always(FullHeightPages.SURVEY_COMPLETED)],
  ])
)

const SlideMixin = ({ transform }: { transform: string }) => `
  &-enter {
    opacity: 0;
    transform: translateX(${transform});
  }

  &-enter-active {
    opacity: 1;
    transition: opacity 150ms, transform 350ms;
    transform: translateX(0rem);
  }

  &-exit {
    opacity: 1;
    transform: translateX(0rem);
  }

  &-exit-active {
    opacity: 0;
    transform: translateX(${({ animation }: { animation: string }) =>
      animation === SlideAnimation.LEFT ? '2' : '-2'}rem);
    transition: opacity 150ms, transform 350ms;
  }
`

const StyledSlideAnimation = styled<React.ElementType>(Box).attrs({
  height: '100%',
})`
  .${SlideAnimation.LEFT} {
    ${SlideMixin({ transform: '-2rem' })}
  }

  .${SlideAnimation.RIGHT} {
    ${SlideMixin({ transform: '2rem' })}
  }
`

const AnimationComponent = ({ location, children }: { location: string }) => {
  const prevLocation = usePrevious(location)
  const prevClassNameAnimation = getAnimation(prevLocation)
  const classNameAnimation = getAnimation(location)
  const queue = [
    Pages.HELP,
    Pages.CHAT_LIST,
    Pages.CHAT,
    Pages.NEW_CHAT,
    Pages.FORM,
    FullHeightPages.SURVEY_COMPLETED,
  ]

  const animation =
    queue.indexOf(classNameAnimation) > queue.indexOf(prevClassNameAnimation)
      ? SlideAnimation.RIGHT
      : SlideAnimation.LEFT

  return (
    <StyledSlideAnimation animation={animation}>
      {children({ animation })}
    </StyledSlideAnimation>
  )
}

export const SwitchScreensAnimation = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <Route
    render={({ location }) => (
      <AnimationComponent location={location.pathname}>
        {({ animation }: { animation: string }) => (
          <TransitionGroup component={null}>
            <CSSTransition
              key={location.key}
              classNames={animation}
              timeout={350}
            >
              <Switch location={location}>{children}</Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      </AnimationComponent>
    )}
  />
)
SwitchScreensAnimation.displayName = 'SwitchScreensAnimation'
