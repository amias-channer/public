import React, { useRef } from "react"
import styled from "styled-components"
import Tooltip from "../../design-system/Tooltip"
import { useSize } from "../../hooks/useSize"

interface Props {
  children: React.ReactNode
  className?: string
}

const Overflow = ({ children, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width] = useSize(containerRef)
  const overflowed =
    containerRef.current && width < containerRef.current.scrollWidth
  return (
    <Tooltip content={children} disabled={!overflowed}>
      <OverflowContainer className={className} ref={containerRef}>
        {children}
      </OverflowContainer>
    </Tooltip>
  )
}

export default Overflow

const OverflowContainer = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
