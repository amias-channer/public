import React, { useState } from "react"
import styled from "styled-components"
import { useTheme } from "../../design-system/Context/ThemeContext"
import Dropdown from "../../design-system/Dropdown"
import Flex from "../../design-system/Flex"
import Text from "../../design-system/Text"
import { trackSetTrendingIn } from "../../lib/analytics/events/homepageEvents"
import { marketPlaceLinks } from "../../lib/helpers/links"
import CollectionsScroller from "./CollectionsScroller.react"
import Icon from "./Icon.react"
import Image from "./Image.react"

const TrendingCollections = () => {
  const [category, setCategory] = useState<string>()
  const [label, setLabel] = useState("all categories")
  const { theme } = useTheme()

  return (
    <FlexContainer>
      <Flex justifyContent="center">
        <Text as="h2" marginRight="8px" textAlign="center" variant="h3">
          Trending in{" "}
          <Dropdown
            content={({ close, List, Item }) => (
              <List>
                {marketPlaceLinks.map(link =>
                  link.label !== "New" ? (
                    <Item
                      key={link.url}
                      onClick={() => {
                        setCategory(
                          link.url === "/assets"
                            ? undefined
                            : link.url.replace("/collection/", ""),
                        )
                        setLabel(
                          link.url === "/assets"
                            ? "all categories"
                            : link.label,
                        )
                        trackSetTrendingIn({ category, label })
                        close()
                      }}
                    >
                      <Item.Content>
                        <Flex alignItems="center">
                          <Image size={24} url={`${link.image}-${theme}.svg`} />
                          <Item.Title marginLeft="8px">
                            {link.url === "/assets"
                              ? "All Categories"
                              : link.label}
                          </Item.Title>
                        </Flex>
                      </Item.Content>
                    </Item>
                  ) : null,
                )}
              </List>
            )}
          >
            <Flex className="TrendingCollections--dropdown">
              <Text
                className="TrendingCollections--category"
                textAlign="center"
                variant="h3"
              >
                {label}
              </Text>
              <Icon
                className="TrendingCollections--icon"
                color="blue"
                value="expand_more"
              />
            </Flex>
          </Dropdown>
        </Text>
      </Flex>
      <CollectionsScroller
        variables={{ categories: category ? [category] : undefined }}
      />
    </FlexContainer>
  )
}

export default TrendingCollections

const FlexContainer = styled(Flex).attrs({ as: "section" })`
  align-items: center;
  flex-direction: column;
  margin-top: 60px;
  margin-bottom: 100px;

  .TrendingCollections--dropdown {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;

    .TrendingCollections--category {
      color: ${props => props.theme.colors.primary};

      &:hover {
        color: ${props => props.theme.colors.darkSeaBlue};
      }
    }

    .TrendingCollections--icon {
      margin: 4px 0 0 4px;
    }
  }
`
