import React from "react"
import styled from "styled-components"
import Block, { BlockProps } from "../../design-system/Block"

const Frame = styled(Block).attrs<BlockProps>(props => ({
  as: props.as ?? "section",
}))`
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`

export const InputFrame = styled(Frame)`
  :focus-within {
    border-color: ${props => props.theme.colors.seaBlue};
  }
`

export default Frame

const Context = React.createContext<{ isFramed?: boolean }>({})

interface ProviderProps {
  children: React.ReactNode
  className?: string
  ref?: (el: HTMLDivElement) => void
}

export const FrameProvider = ({ children, className, ref }: ProviderProps) => (
  <Context.Provider value={{ isFramed: true }}>
    <div className={className} ref={ref}>
      {children}
    </div>
  </Context.Provider>
)

// FIXME: This feels like a hack.
export const FrameConfiscator = ({ children, className }: ProviderProps) => (
  <Context.Provider value={{ isFramed: false }}>
    <div className={className}>{children}</div>
  </Context.Provider>
)

export const FrameConsumer = Context.Consumer
