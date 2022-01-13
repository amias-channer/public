// Needed to prevent regeneratorRuntime is not defined error
import "regenerator-runtime/runtime"
import React, { useState } from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import Block from "../../design-system/Block"
import Lightbox from "../../design-system/Lightbox"
import Loader, { LoaderProps } from "../../design-system/Loader/Loader.react"
import Text from "../../design-system/Text"
import useAppContext from "../../hooks/useAppContext"
import useToasts from "../../hooks/useToasts"
import { ProfileImage_data$key } from "../../lib/graphql/__generated__/ProfileImage_data.graphql"
import { ProfileImageMutation } from "../../lib/graphql/__generated__/ProfileImageMutation.graphql"
import { clearCache } from "../../lib/graphql/environment/middlewares/cacheMiddleware"
import { graphql } from "../../lib/graphql/graphql"
import { selectClassNames } from "../../lib/helpers/styling"
import ImageInput from "../forms/ImageInput.react"
import CenterAligned from "./CenterAligned.react"
import Icon from "./Icon.react"
import Image from "./Image.react"

interface Props {
  className?: string
  editable?: boolean
  isDynamic?: boolean
  loaderSize?: LoaderProps["size"]
  size?: number
  dataKey: ProfileImage_data$key
}

type ImageStatus = "done" | "standby" | "wait"

const ProfileImage = ({
  className,
  editable,
  isDynamic,
  size,
  loaderSize,
  dataKey,
}: Props) => {
  const [imageStatus, setImageStatus] = useState<ImageStatus>("standby")
  const { attempt } = useToasts()
  const { mutate } = useAppContext()

  const { imageUrl, address } = useFragment(
    graphql`
      fragment ProfileImage_data on AccountType {
        imageUrl
        address
      }
    `,
    dataKey,
  )

  const editImage = async ({ value }: { value: File }): Promise<void> => {
    setImageStatus("wait")

    await attempt(async () => {
      await mutate<ProfileImageMutation>(
        graphql`
          mutation ProfileImageMutation($input: AccountMutationInput!) {
            account(input: $input) {
              imageUrl
            }
          }
        `,
        { input: { identity: { address }, profileImage: value } },
        { shouldAuthenticate: true },
      )
      clearCache()
      setImageStatus("done")
    })
  }

  const renderImage = ({ onClick }: { onClick?: () => unknown } = {}) => {
    return (
      <Image
        className="ProfileImage--image"
        size={size}
        sizing="cover"
        url={imageUrl}
        variant="round"
        onClick={onClick}
      />
    )
  }

  const renderBody = () => {
    return (
      <>
        {editable && (
          <>
            <ImageInput className="ProfileImage--input" onChange={editImage} />
            <OverlaidContainer
              borderRadius="50%"
              className="ProfileImage--overlay-background"
            />

            <OverlaidContainer
              as={CenterAligned}
              className="ProfileImage--overlay-text"
            >
              <Icon value="edit" />
              <Text as="span" color="inherit" variant="pre-title">
                Edit
              </Text>
            </OverlaidContainer>
          </>
        )}

        {imageStatus === "wait" ? (
          <div className="ProfileImage--loader">
            <Loader size={loaderSize} />
          </div>
        ) : (
          <Lightbox trigger={open => renderImage({ onClick: open })}>
            <Image
              className="ProfileImage--image"
              sizing="cover"
              url={imageUrl}
              variant="round"
            />
          </Lightbox>
        )}
      </>
    )
  }

  return (
    <DivContainer
      className={selectClassNames("ProfileImage", { editable }, className)}
    >
      {isDynamic ? renderBody() : renderImage()}
    </DivContainer>
  )
}

export default ProfileImage

const OverlaidContainer = styled(Block)`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
`

const DivContainer = styled.div`
  position: relative;

  .ProfileImage--input {
    height: 100%;
    opacity: 0;
    position: absolute;
    padding: 0;
    margin: 0;
    border: 0;
    width: 100%;
    z-index: 2;
  }

  .ProfileImage--loader {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ProfileImage--image {
    cursor: pointer;
  }

  .ProfileImage--overlay-text {
    color: ${props => props.theme.colors.white};
  }

  &.ProfileImage--editable:hover {
    .ProfileImage--overlay-background {
      opacity: 0.5;
      background: ${props => props.theme.colors.charcoal};
    }

    .ProfileImage--overlay-text {
      opacity: 1;
    }
  }
`
