import LottiePlayer from 'lottie-web/build/player/lottie_light'
import { disableTransitions } from '@revolut/ui-kit'

const disableLottieAnimations = () => {
  window.finishLottieAnimation = () => {
    // @ts-expect-error wrong typings in Lottie. No typings for getRegisteredAnimations method.
    const [animation] = LottiePlayer.getRegisteredAnimations()

    if (animation) {
      const frame = animation.getDuration(true)

      animation.goToAndStop(frame, true)
    }
  }
}

export const setupCypressConfig = () => {
  disableTransitions()
  disableLottieAnimations()
}
