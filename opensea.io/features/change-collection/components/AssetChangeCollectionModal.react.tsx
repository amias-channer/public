import React from "react"
import { Controller, useForm } from "react-hook-form"
import CollectionSelect from "../../../components/forms/CollectionSelect"
import Block from "../../../design-system/Block"
import Button from "../../../design-system/Button"
import Modal, { UncontrolledModalProps } from "../../../design-system/Modal"
import Text from "../../../design-system/Text"
import useAppContext from "../../../hooks/useAppContext"
import useIsOpen from "../../../hooks/useIsOpen"
import useToasts from "../../../hooks/useToasts"
import { useTranslations } from "../../../hooks/useTranslations"
import { trackMoveAssetCollection } from "../../../lib/analytics/events/collectionEvents"
import { AssetCardFooter_asset } from "../../../lib/graphql/__generated__/AssetCardFooter_asset.graphql"
import { AssetChangeCollectionModallMutation } from "../../../lib/graphql/__generated__/AssetChangeCollectionModallMutation.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import { pluralize } from "../../../lib/helpers/stringUtils"

type Props = Pick<UncontrolledModalProps, "trigger"> & {
  assets: string[]
  onSuccess: () => unknown
}

type UseFormData = {
  collection: { label: string; value: string }
}

export const AssetChangeCollectionModal = ({
  trigger,
  onSuccess,
  assets,
}: Props) => {
  const { tr } = useTranslations()
  const { mutate } = useAppContext()
  const { attempt, showSuccessMessage } = useToasts()
  const { isOpen, open, close } = useIsOpen()
  const numItems = assets.length

  const { handleSubmit, control, formState } = useForm<UseFormData>({
    mode: "onChange",
  })

  const onSubmit = handleSubmit(async ({ collection }) => {
    trackMoveAssetCollection()

    await attempt(async () => {
      await mutate<AssetChangeCollectionModallMutation>(
        graphql`
          mutation AssetChangeCollectionModallMutation(
            $assets: [AssetRelayID]!
            $collection: CollectionSlug!
          ) {
            assets {
              changeCollection(assets: $assets, collection: $collection) {
                collection {
                  slug
                }
              }
            }
          }
        `,
        { assets, collection: collection.value },
        {
          shouldAuthenticate: true,
          updater: store => {
            assets.forEach(assetRelayId => {
              const assetRecord = store.get<AssetCardFooter_asset>(assetRelayId)
              const assetCollection = assetRecord?.getLinkedRecord("collection")

              if (assetCollection) {
                assetCollection.setValue(collection.label, "name")
                assetCollection.setValue(collection.value, "slug")
              }
            })
          },
        },
      )

      showSuccessMessage(
        `Sucessfully moved ${numItems} ${pluralize("item", numItems)} to ${
          collection.label
        }`,
      )

      close()
      onSuccess()
    })
  })

  return (
    <>
      {trigger(open)}
      <Modal
        focusFirstFocusableElement={false}
        isOpen={isOpen}
        overrides={{
          Dialog: { props: { as: "form", onSubmit, autoComplete: "off" } },
        }}
        onClose={close}
      >
        <Modal.Header>
          <Modal.Title>{tr("Move to new collection")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Block marginBottom={"4px"}>
            <label htmlFor="collection" style={{ fontWeight: 600 }}>
              {tr("Collection")}
            </label>
          </Block>

          <Controller
            control={control}
            name="collection"
            render={({ field }) => {
              const { ref: _ref, onChange, ...rest } = field
              return (
                <CollectionSelect
                  {...rest}
                  id={field.name}
                  onSelect={onChange}
                />
              )
            }}
            rules={{ required: true }}
          />

          <Block marginTop="16px">
            <Text as="span" variant="small">
              Moving items to a different collection may take up to 30 minutes.
            </Text>
          </Block>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!formState.isValid}
            isLoading={formState.isSubmitting}
            type="submit"
          >
            {numItems === 1 ? tr("Move") : `Move ${numItems} items`}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
