import React from "react"
import { merge } from "lodash"
import Modal, { UncontrolledModalProps } from "../Modal"

export type LightboxProps = Pick<
  UncontrolledModalProps,
  "children" | "trigger" | "initiallyOpen" | "overrides"
>

export const Lightbox = ({
  children,
  trigger,
  initiallyOpen,
  overrides,
}: LightboxProps) => {
  const defaultOverrides: UncontrolledModalProps["overrides"] = {
    Dialog: {
      props: {
        style: {
          height: "min(calc(100vw - 50px), calc(100vh - 50px))",
          width: "min(calc(100vw - 50px), calc(100vh - 50px))",
          background: "transparent",
          border: 0,
          position: "initial",
          borderRadius: "initial",
        },
      },
    },
    CloseRoot: {
      style: { top: 8, right: 8 },
    },
  }

  return (
    <Modal
      focusFirstFocusableElement={false}
      initiallyOpen={initiallyOpen}
      overrides={merge(defaultOverrides, overrides)}
      position="centered"
      trigger={trigger}
    >
      {children}
    </Modal>
  )
}

export default Lightbox
