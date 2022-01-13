import React, { useState } from "react"
import { isFunction, noop } from "lodash"
import styled, { css } from "styled-components"
import { Z_INDEX } from "../../constants/zIndex"
import Drawer from "../../design-system/Drawer"
import { Media } from "../../design-system/Media"
import UnstyledButton from "../../design-system/UnstyledButton"
import useAppContext from "../../hooks/useAppContext"
import { useTranslations } from "../../hooks/useTranslations"
import {
  trackCloseSidebarFilter,
  trackOpenSidebarFilter,
} from "../../lib/analytics/events/searchEvents"
import { selectClassNames } from "../../lib/helpers/styling"
import { $nav_height } from "../../styles/variables"
import Icon from "../common/Icon.react"
import { sizeMQ } from "../common/MediaQuery.react"
import { FrameProvider } from "../layout/Frame.react"

interface MobileHeaderProps {
  clear: () => unknown
  close: () => unknown
}

interface CommonProps {
  clear: () => unknown
  children: ((close: () => unknown) => React.ReactNode) | React.ReactNode
}

interface FilterContentProps extends CommonProps {
  isMobile?: boolean
  closeFilterSidebar: () => void
  isFilterSidebarOpen: boolean
  closeIfMobile: () => void
}

interface Props extends CommonProps {
  anchorSide?: "left" | "right"
  className?: string
  numFiltersApplied: number
  sidebarCollapsed?: boolean
}

const MobileHeader = ({ clear, close }: MobileHeaderProps) => {
  const { tr } = useTranslations()
  return (
    <header className="SearchFilter--header">
      <UnstyledButton
        className="SearchFilter--header-button SearchFilter--header-clear"
        onClick={clear}
      >
        {tr("Clear All")}
      </UnstyledButton>
      <UnstyledButton
        className="SearchFilter--header-button SearchFilter--header-done"
        onClick={close}
      >
        {tr("Done")}
      </UnstyledButton>
    </header>
  )
}

const FilterSidebar = ({
  isMobile,
  clear,
  closeFilterSidebar,
  isFilterSidebarOpen,
  children,
  closeIfMobile,
}: FilterContentProps) => {
  const { tr } = useTranslations()
  return (
    <div className="SearchFilter--main">
      {isMobile ? (
        <MobileHeader clear={clear} close={closeFilterSidebar} />
      ) : (
        <header className="SearchFilter--header">
          <UnstyledButton
            className="SearchFilter--header-button-container"
            onClick={closeFilterSidebar}
          >
            <div className="SearchFilter--header-label">
              <Icon className="SearchFilter--header-icon" value="filter_list" />
              {tr("Filter")}
            </div>
            <div className="SearchFilter-expand-icon-container">
              <Icon
                className={selectClassNames(
                  "SearchFilter--header-expand-icon",
                  {
                    toggle: isFilterSidebarOpen,
                  },
                )}
                value="arrow_back"
              />
            </div>
          </UnstyledButton>
        </header>
      )}
      {isFunction(children) ? children(closeIfMobile) : children}
    </div>
  )
}

const SearchFilter = ({
  anchorSide,
  className,
  clear,
  children,
  numFiltersApplied,
  sidebarCollapsed,
}: Props) => {
  const { isEmbedded, isMobile } = useAppContext()

  // Mobile starts with filter sidebar closed
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(
    !isMobile && !sidebarCollapsed,
  )

  const openFilterSidebar = () => {
    setIsFilterSidebarOpen(true)
    trackOpenSidebarFilter()
  }

  const closeFilterSidebar = () => {
    setIsFilterSidebarOpen(false)
    trackCloseSidebarFilter()
  }

  const closeIfMobile = () => {
    if (isMobile) {
      closeFilterSidebar()
    }
  }

  const filterSidebarProps = {
    isMobile,
    clear,
    closeFilterSidebar,
    isFilterSidebarOpen,
    children,
    closeIfMobile,
  }

  return (
    <DivContainer
      className={selectClassNames(
        "SearchFilter",
        { isFilterSidebarOpen },
        className,
      )}
      isEmbedded={isEmbedded}
    >
      <Media lessThan="sm">
        {(mediaClassNames, renderChildren) =>
          renderChildren && (
            <Drawer
              anchorSide={anchorSide}
              className={mediaClassNames}
              isBannerShown={false}
              isOpen={isFilterSidebarOpen}
              navbarOffset={$nav_height}
              onClickAway={noop}
            >
              <FilterSidebar {...filterSidebarProps} />
            </Drawer>
          )
        }
      </Media>
      <Media greaterThanOrEqual="sm">
        {(_mediaClassNames, renderChildren) =>
          renderChildren ? (
            <>
              {isFilterSidebarOpen ? (
                <FilterSidebar {...filterSidebarProps} />
              ) : (
                <UnstyledButton
                  className="SearchFilter--main"
                  onClick={openFilterSidebar}
                >
                  <header className="SearchFilter--header">
                    <div className="SearchFilter-expand-icon-container">
                      <Icon
                        className={selectClassNames(
                          "SearchFilter--header-expand-icon",
                          {
                            toggle: isFilterSidebarOpen,
                          },
                        )}
                        value="arrow_forward"
                      />
                    </div>
                  </header>
                </UnstyledButton>
              )}
            </>
          ) : null
        }
      </Media>
      <div
        className="SearchFilter--opener-wrapper"
        style={isEmbedded ? { bottom: "64px" } : undefined}
      >
        <UnstyledButton
          className="SearchFilter--opener"
          onClick={() => openFilterSidebar()}
        >
          Filter
          {numFiltersApplied ? (
            <div className="SearchFilter--opener-count">
              {numFiltersApplied}
            </div>
          ) : null}
        </UnstyledButton>
      </div>
    </DivContainer>
  )
}

export default SearchFilter

const DivContainer = styled(FrameProvider)<{
  isEmbedded?: boolean
}>`
  border-right: 1px solid ${props => props.theme.colors.border};
  box-sizing: border-box;

  ${props =>
    props.isEmbedded &&
    css`
      top: 0;
    `}

  ${sizeMQ({
    mobile: css`
      width: 60px;
      overflow: auto;
    `,
  })}

  .SearchFilter--main {
    width: 100%;
    z-index: ${Z_INDEX.SEARCH_FILTER};

    .SearchFilter--header {
      background-color: ${props => props.theme.colors.background};
      border-bottom: none;
      align-items: center;
      display: none;
      flex: none;
      order: 1;
      flex-grow: 0;
      height: 60px;
      justify-content: space-between;
      padding: 16px 16px;
      position: sticky;
      top: 0;
      z-index: 1;

      .SearchFilter--header-button-container {
        align-items: center;
        display: flex;
        flex: none;
        flex-grow: 0;
        order: 1;
        top: 0;
        justify-content: space-between;
        width: 100%;
      }

      .SearchFilter--header-button {
        color: ${props => props.theme.colors.primary};
        font-size: 16px;
        font-weight: 500;
        margin-right: 5px;
        cursor: pointer;
        display: flex;
        flex: none;
        order: 1;
        flex-grow: 0;
      }

      .SearchFilter--header-clear {
        text-align: left;
        cursor: pointer;
      }

      .SearchFilter--header-done {
        text-align: right;
      }

      .SearchFilter--header-label {
        color: ${props => props.theme.colors.text.heading};
        font-size: 16px;
        font-weight: 600;
        display: flex;
        flex: none;
        order: 0;
        flex-grow: 0;

        .SearchFilter--header-icon {
          margin-right: 10px;
        }
      }

      .SearchFilter-expand-icon-container {
        color: ${props => props.theme.colors.withOpacity.text.heading.medium};
        margin-right: 5px;
        margin-top: 5px;
        align-self: flex-end;
      }

      @media (hover: hover) {
        &:hover {
          box-shadow: ${props => props.theme.shadow};

          .SearchFilter-expand-icon-container {
            color: ${props => props.theme.colors.text.heading};
          }
        }
      }
    }
  }

  .SearchFilter--opener-wrapper {
    bottom: 20px;
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    z-index: 4;

    .SearchFilter--opener {
      display: flex;
      align-items: center;
      background-color: ${props => props.theme.colors.primary};
      border-radius: 25px;
      box-shadow: 0px 1px 20px rgba(0, 0, 0, 0.25);
      color: white;
      display: flex;
      font-size: 16px;
      font-weight: 600;
      height: 50px;
      justify-content: center;
      width: 292px;

      .SearchFilter--opener-count {
        background-color: white;
        color: ${props => props.theme.colors.primary};
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        text-align: center;
        align-items: center;
        margin-left: 10px;
      }
    }
  }

  &.SearchFilter--isFilterSidebarOpen {
    display: block;
    border-right: none;

    .SearchFilter--main {
      display: block;
      background-color: ${props => props.theme.colors.surface};
      border-right: 1px solid ${props => props.theme.colors.border};
    }

    .SearchFilter--opener-wrapper {
      display: none;
    }

    .SearchFilter--header {
      display: flex;
      border-bottom: 1px solid ${props => props.theme.colors.border};
      background-color: ${props => props.theme.colors.header};
    }
  }

  ${sizeMQ({
    mobile: css`
      align-self: flex-start;
      flex-shrink: 0;
      height: calc(100vh - ${$nav_height});
      position: sticky;
      top: ${$nav_height};

      &.SearchFilter--isFilterSidebarOpen {
        width: 275px;

        .SearchFilter--main {
          height: 100%;

          .SearchFilter--header {
            height: 60px;

            .SearchFilter-expand-icon-container {
              .SearchFilter--header-expand-icon {
                margin: 0px 10px;
              }
            }
            @media (hover: hover) {
              &:hover {
                box-shadow: ${props => props.theme.shadow};

                .SearchFilter-expand-icon-container {
                  color: ${props => props.theme.colors.text.heading};
                }
              }
            }
          }
        }
      }

      .SearchFilter--main {
        display: block;
        position: initial;
        top: initial;
        z-index: 3;

        .SearchFilter--header {
          height: 100%;
          cursor: pointer;
          top: 0;
          display: flex;

          .SearchFilter-expand-icon-container {
            align-self: flex-start;
            top: 0;
          }
        }
      }

      .SearchFilter--opener-wrapper {
        display: none;
      }
    `,
    medium: css`
      &.SearchFilter--isFilterSidebarOpen {
        width: 340px;

        .SearchFilter--header {
          height: 60px;
        }
      }
    `,
  })}
`
