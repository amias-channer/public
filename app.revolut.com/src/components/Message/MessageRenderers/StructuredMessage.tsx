import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl'
import { Flex, TextBox } from '@revolut/ui-kit'
import { isSameYear } from 'date-fns'
import { rgba } from 'polished'

import {
  StructuredMessageFieldType,
  StructuredMessageContainerType,
  StructuredMessageField,
  StructuredMessageContainer,
  StructuredMessageFileField,
  StructuredMessageClass,
} from '../../../constants/structuredMessage'
import { MessageMarkdown } from '../MessageMarkdown'
import { MessageWrapper, TextMessage } from '../styles'

import { ImageMessage } from './ImageMessage'
import { isPDFType, findFileFields } from '../../../helpers/utils'
import { PdfMessage } from './PdfMessage'

// This is used to convert time in "00:00:00Z" format into ISO 8601 date,
// to be able to display it with react-intl FormattedTime component.
const UNIX_EPOCH_ISO_DATE_PART = '1970-01-01T'

type StyledWrapperProps = {
  classes?: StructuredMessageClass[]
  children: ReactNode
} & ComponentPropsWithoutRef<typeof TextBox>

const StyledWrapper = ({ classes, children, ...rest }: StyledWrapperProps) => {
  const styleProps: ComponentPropsWithoutRef<typeof TextBox> = {
    variant: 'primary',
  }

  if (classes) {
    for (const messageClass of classes) {
      switch (messageClass) {
        case StructuredMessageClass.BOLD:
          // TODO: Restore bold renderer, as soon as 'bold' class will be removed from each question on the BE.
          // styleProps.fontWeight = 500
          break
        case StructuredMessageClass.ITALIC:
          styleProps.style = { fontStyle: 'italic' }
          break
        case StructuredMessageClass.HEADING_1:
          styleProps.variant = 'h3'
          break
        case StructuredMessageClass.HEADING_2:
          styleProps.variant = 'h4'
          break
        case StructuredMessageClass.HEADING_3:
          styleProps.color = rgba('white', 0.5)
          styleProps.variant = 'secondary'
          break
        default:
          break
      }
    }
  }

  return (
    <TextBox {...styleProps} {...rest}>
      {children}
    </TextBox>
  )
}

type FieldProps = {
  field: StructuredMessageField
}

const Field = ({ field }: FieldProps) => {
  switch (field.type) {
    case StructuredMessageFieldType.TEXT:
      return <MessageMarkdown linkColor='white'>{field.value}</MessageMarkdown>
    case StructuredMessageFieldType.DATE:
      return (
        <FormattedDate
          value={field.value}
          year={isSameYear(field.value, new Date()) ? undefined : 'numeric'}
          month='short'
          day='numeric'
          weekday='short'
        />
      )
    case StructuredMessageFieldType.TIME:
      return (
        <FormattedTime
          value={UNIX_EPOCH_ISO_DATE_PART + field.value}
          timeZone='utc'
        />
      )
    case StructuredMessageFieldType.PHONE:
      return <>{field.value}</>
    case StructuredMessageFieldType.MONEY:
      return (
        <>
          {field.amount} {field.currency}
        </>
      )
    case StructuredMessageFieldType.BOOLEAN:
      return (
        <>
          {field.value ? (
            <FormattedMessage
              id='supportChat.message.booleanTrue'
              defaultMessage='True'
            />
          ) : (
            <FormattedMessage
              id='supportChat.message.booleanFalse'
              defaultMessage='False'
            />
          )}
        </>
      )
    case StructuredMessageFieldType.FILE:
      return <>{field.filename}</>
    default:
      return null
  }
}

type ContainerProps = {
  container: StructuredMessageContainer
}

const Container = ({ container }: ContainerProps) => {
  const isVertical = container.type === StructuredMessageContainerType.VBOX
  const flexDirection = isVertical ? 'column' : 'row'
  const marginProp = isVertical ? 'mb' : 'mr'

  return (
    <Flex flexDirection={flexDirection}>
      {container?.content.map((item, index, { length }) => {
        const isLast = index === length - 1
        const spacingProps = {
          [marginProp]: `${container.spacing?.value}${container.spacing?.unit}`,
        }
        return (
          <StyledWrapper
            key={index}
            classes={item.classes}
            {...(isLast ? {} : spacingProps)}
          >
            {(() => {
              switch (item.type) {
                case StructuredMessageContainerType.HBOX:
                case StructuredMessageContainerType.VBOX:
                  return <Container container={item} />
                default:
                  return <Field field={item} />
              }
            })()}
          </StyledWrapper>
        )
      })}
    </Flex>
  )
}

type StructuredMessageProps = {
  className: string
  content: StructuredMessageContainer
}

export const StructuredMessage = ({
  className,
  content,
}: StructuredMessageProps) => {
  const fileFields: StructuredMessageFileField[] = findFileFields(content)

  return (
    <>
      <MessageWrapper bg='primary' px={2} py={1} className={className}>
        <TextMessage color='white'>
          <Container container={content} />
        </TextMessage>
      </MessageWrapper>

      {fileFields.map((fileField) => {
        const isPDF = isPDFType(fileField.mediaType)

        if (isPDF) {
          return (
            <PdfMessage
              key={fileField.id}
              className={className}
              fileName={fileField.filename}
              src={fileField.url}
            />
          )
        }

        return (
          <ImageMessage
            key={fileField.id}
            className={className}
            fileName={fileField.filename}
            src={fileField.url}
          />
        )
      })}
    </>
  )
}
