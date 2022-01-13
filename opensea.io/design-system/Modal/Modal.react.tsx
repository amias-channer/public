import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { useWindowHeight } from "@react-hook/window-size"
import { isFunction, noop } from "lodash"
import { createPortal } from "react-dom"
import { useKeyPressEvent } from "react-use"
import styled, { css } from "styled-components"
import CenterAligned from "../../components/common/CenterAligned.react"
import Icon from "../../components/common/Icon.react"
import { IS_SERVER } from "../../constants"
import { Z_INDEX } from "../../constants/zIndex"
import { useCallbackRef } from "../../hooks/useCallbackRef"
import useIsOpen from "../../hooks/useIsOpen"
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll"
import { useSize } from "../../hooks/useSize"
import { UnreachableCaseError } from "../../lib/helpers/type"
import { Block } from "../Block"
import Flex from "../Flex"
import FlexVertical, { FlexVerticalProps } from "../FlexVertical"
import Overlay from "../Overlay"
import Text from "../Text"
import UnstyledButton from "../UnstyledButton"
import { focusFirstNode, handleTabPress } from "./focus"

type ModalSize = "medium" | "large"

export type BaseModalProps = {
  position?: "centered" | "top"
  children?: React.ReactNode
  parent?: () => HTMLElement
  closeLabel?: string
  focusFirstFocusableElement?: boolean
  closeOnEscape?: boolean
  lockBodyScroll?: boolean
  lockFocus?: boolean
  closeOnOverlayClick?: boolean
  closable?: boolean
  disabled?: boolean
  size?: ModalSize
  overrides?: {
    Dialog?: {
      props?: FlexVerticalProps & Record<string, unknown>
    }
    CloseRoot?: {
      style?: CSSProperties
    }
  }
  onClose?: () => unknown
}

export type UncontrolledModalProps = BaseModalProps & {
  trigger: (open: () => unknown) => React.ReactNode
  children?: React.ReactNode | ((close: () => unknown) => React.ReactNode)
  initiallyOpen?: boolean
}

export type ControlledModalProps = BaseModalProps & {
  isOpen: boolean
}

export type ModalProps = ControlledModalProps | UncontrolledModalProps

export const isControlledModal = (
  props: ModalProps,
): props is ControlledModalProps => {
  return (props as ControlledModalProps).isOpen !== undefined
}

const ModalBase = (props: ModalProps) => {
  // Only render modal on the browser (portals aren't supported server-side)
  if (IS_SERVER) {
    return null
  }

  if (isControlledModal(props)) {
    return <ControlledModal {...props} />
  }
  return <UncontrolledModal {...props} />
}

const UncontrolledModal = ({
  trigger,
  children,
  initiallyOpen,
  disabled,
  onClose,
  ...baseModalProps
}: UncontrolledModalProps) => {
  const { isOpen, open, close } = useIsOpen(initiallyOpen)
  const childrenContent = isFunction(children) ? children(close) : children

  const handleClose = useCallback(() => {
    onClose?.()
    close()
  }, [close, onClose])

  if (disabled) {
    return <>{trigger(noop)}</>
  }

  return (
    <>
      {trigger(open)}
      <ControlledModal
        {...baseModalProps}
        isOpen={isOpen}
        onClose={handleClose}
      >
        {childrenContent}
      </ControlledModal>
    </>
  )
}

const MODAL_PADDING = "24px"
const DIALOG_MARGIN = 16
const AXIS_MARGIN = 2 * DIALOG_MARGIN

const SIZE_MAPPINGS: Record<ModalSize, number> = {
  medium: 550,
  large: 700,
}

const ControlledModal = ({
  isOpen,
  onClose,
  parent,
  closeOnOverlayClick = true,
  ...rest
}: ControlledModalProps) => {
  const node = useMemo(() => document.createElement("div"), [])

  // Portal container
  useEffect(() => {
    const getParent = () => {
      return parent?.() ?? document.body
    }
    getParent().appendChild(node)
    return () => {
      getParent().removeChild(node)
    }
  }, [node, parent])

  return createPortal(
    <Overlay
      active={isOpen}
      backgroundColor="rgba(0, 0, 0, 0.8)"
      transitionDuration={0.3}
      zIndex={Z_INDEX.MODAL}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      {isOpen ? <ModalDialog {...rest} onClose={onClose} /> : null}
    </Overlay>,
    node,
  )
}

const ModalDialog = ({
  children,
  onClose,
  focusFirstFocusableElement = true,
  closeOnEscape = true,
  lockBodyScroll = true,
  lockFocus = true,
  closable = true,
  overrides,
  closeLabel = "Close",
  size = "medium",
  position = "top",
}: Omit<
  ControlledModalProps,
  "isOpen" | "parent" | "closeOnOverylayClick"
>) => {
  const lastActiveElementRef = useRef<HTMLElement>(
    null,
  ) as MutableRefObject<HTMLElement | null>
  const [dialogRef, setRef] = useCallbackRef<HTMLDivElement>()

  useKeyPressEvent("Escape", closeOnEscape ? onClose : undefined)
  useLockBodyScroll(lockBodyScroll, dialogRef)

  // Focus lock
  useEffect(() => {
    const dialog = dialogRef.current
    const onKeyDown = (event: KeyboardEvent) => {
      if (lockFocus && event.key === "Tab" && dialog) {
        handleTabPress(dialog, event)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [lockFocus, dialogRef])

  // Focus first focusable element
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && focusFirstFocusableElement) {
      lastActiveElementRef.current = document.activeElement as HTMLElement
      focusFirstNode(dialog)
    }

    // return focus to the element that triggered modal
    return () => {
      lastActiveElementRef.current?.focus()
    }
  }, [focusFirstFocusableElement, dialogRef])

  const renderModalContent = (isFullHeight?: boolean) => {
    return (
      <Dialog
        $isFullHeight={isFullHeight}
        $position={position}
        $width={SIZE_MAPPINGS[size]}
        aria-modal="true"
        ref={setRef}
        role="dialog"
        onClick={event => {
          // We are preventing dialog from closing on dialog click
          event.stopPropagation()
        }}
        {...(overrides?.Dialog?.props as unknown)}
      >
        {children}

        {/* this comes after children so that firstFocusableElement is not close icon */}
        {onClose && closable && (
          <Flex
            position="absolute"
            right={MODAL_PADDING}
            top={MODAL_PADDING}
            {...overrides?.CloseRoot}
          >
            <UnstyledButton onClick={onClose}>
              <StyledIcon aria-label={closeLabel} value="close" />
            </UnstyledButton>
          </Flex>
        )}
      </Dialog>
    )
  }

  switch (position) {
    case "centered":
      return <CenterAligned height="100%">{renderModalContent()}</CenterAligned>
    case "top":
      return <TopPaddedContainer>{renderModalContent}</TopPaddedContainer>
    default:
      throw new UnreachableCaseError(position)
  }
}

const TopPaddedContainer = ({
  children,
}: {
  children: (isFullHeight: boolean) => React.ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [_, height] = useSize(ref)
  const windowHeight = useWindowHeight()
  const diff = windowHeight - height
  const desiredMargin = 0.1 * windowHeight

  const margin =
    diff <= 0 ? 0 : diff < desiredMargin ? Math.ceil(diff / 2) : desiredMargin

  return (
    <Flex
      justifyContent="center"
      marginBottom={`${margin}px`}
      marginTop={`${margin}px`}
      ref={ref}
    >
      {children(margin === 0)}
    </Flex>
  )
}

const Dialog = styled(FlexVertical)<{
  $width: number
  $position: "centered" | "top"
  $isFullHeight?: boolean
}>`
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  background: ${props => props.theme.colors.card};
  width: ${props => props.$width}px;
  max-height: ${props =>
    `calc(100vh - ${props.$position === "centered" ? AXIS_MARGIN : 0}px)`};
  max-width: ${`calc(100% - ${AXIS_MARGIN}px)`};

  // make the modal fullscreen on mobile
  @media (max-width: ${props => props.$width + AXIS_MARGIN}px) {
    margin: 0;
    max-width: 100%;
    max-height: 100vh;
  }

  // remove border radius once it touches screen
  @media (max-width: ${props => props.$width}px) {
    border-radius: 0;
  }

  ${props =>
    props.$isFullHeight &&
    css`
      border-radius: 0;
    `}
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.gray};
  :hover {
    color: ${props => props.theme.colors.darkGray};
  }
`

const ModalBody = styled(Block).attrs({ as: "section" })`
  height: ${props => props.height ?? "100%"};
  overflow-y: auto;
`

ModalBody.defaultProps = {
  padding: MODAL_PADDING,
}

const StyledModalHeader = styled(Block).attrs({ as: "header" })`
  padding: ${MODAL_PADDING};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  ${Text} {
    text-align: center;
    width: 100%;
    word-break: break-word;
    padding: 0 ${MODAL_PADDING};
  }
`

type ModalHeaderProps = {
  onPrevious?: () => unknown
  backLabel?: string
  children: React.ReactNode
}

const ModalHeader = ({
  onPrevious,
  backLabel = "Back",
  children,
}: ModalHeaderProps) => {
  return (
    <StyledModalHeader>
      {onPrevious && (
        <Flex left={MODAL_PADDING} position="absolute" top={MODAL_PADDING}>
          <UnstyledButton onClick={onPrevious}>
            <StyledIcon aria-label={backLabel} value="arrow_back" />
          </UnstyledButton>
        </Flex>
      )}
      {children}
    </StyledModalHeader>
  )
}

const ModalFooter = styled(Block).attrs({ as: "footer" })`
  display: flex;
  justify-content: center;
  padding: ${MODAL_PADDING};
  border-top: 1px solid ${props => props.theme.colors.border};
`

const ModalTitle = styled(Text)`
  margin: 0;
`

ModalTitle.defaultProps = {
  variant: "h4",
}

export const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
})

export default Modal
