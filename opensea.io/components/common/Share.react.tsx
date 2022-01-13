import React, { useEffect } from "react"
import qs from "qs"
import { useCopyToClipboard } from "react-use"
import {
  OPENSEA_TWITTER_HANDLE,
  DEFAULT_ACCOUNT_TWITTER_MESSAGE,
  OPENSEA_LOGO_IMG,
} from "../../constants"
import Dropdown from "../../design-system/Dropdown"
import Tooltip from "../../design-system/Tooltip"
import useToasts from "../../hooks/useToasts"
import API from "../../lib/api"
import Router from "../../lib/helpers/router"
import { initTwitter } from "../../lib/helpers/twitter"

interface Props {
  children: React.ReactElement
  url?: string
  onEmbed?: () => unknown
}

const Share = ({ children, url, onEmbed }: Props) => {
  const { showSuccessMessage } = useToasts()
  const [_, copy] = useCopyToClipboard()

  useEffect(() => {
    initTwitter()
  }, [])

  const getFullUrl = () => {
    return url ? `${API.getWebUrl()}${url}` : Router.getHrefWithMergedQuery()
  }

  return (
    <Dropdown
      content={({ close, List, Item }) => (
        <List>
          <Item
            onClick={() => {
              copy(getFullUrl())
              close()
              showSuccessMessage("Link copied!")
            }}
          >
            <Item.Avatar src={OPENSEA_LOGO_IMG} />
            <Item.Content>
              <Item.Title>Copy Link</Item.Title>
            </Item.Content>
          </Item>
          <Item
            href={`https://www.facebook.com/sharer/sharer.php?u=${getFullUrl()}`}
            onClick={close}
          >
            <Item.Avatar src="/static/images/logos/facebook.png" />
            <Item.Content>
              <Item.Title>Share on Facebook</Item.Title>
            </Item.Content>
          </Item>
          <Item
            href={`https://twitter.com/intent/tweet?${qs.stringify({
              text: `${DEFAULT_ACCOUNT_TWITTER_MESSAGE}`,
              url: getFullUrl(),
              via: OPENSEA_TWITTER_HANDLE,
            })}`}
          >
            <Item.Avatar src="/static/images/logos/twitter.svg" />
            <Item.Content>
              <Item.Title>Share to Twitter</Item.Title>
            </Item.Content>
          </Item>
          {onEmbed ? (
            <Item
              onClick={() => {
                onEmbed()
                close()
              }}
            >
              <Item.Avatar icon="code" />
              <Item.Content>
                <Item.Title>Embed Asset</Item.Title>
              </Item.Content>
            </Item>
          ) : null}
        </List>
      )}
      placement="bottom-end"
    >
      <Tooltip content="Share">{children}</Tooltip>
    </Dropdown>
  )
}

export default Share
