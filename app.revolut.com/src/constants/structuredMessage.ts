/* eslint-disable coherence/no-confusing-enum */
import { PayloadType } from '../api/types'

export type StructuredMessageFiles = { [id: string]: File }

export enum StructuredMessageContainerType {
  VBOX = 'vbox',
  HBOX = 'hbox',
}

export enum StructuredMessageFieldType {
  TEXT = 'text',
  DATE = 'date',
  TIME = 'time',
  PHONE = 'phone',
  MONEY = 'money',
  BOOLEAN = 'boolean',
  FILE = 'file',
}

export enum StructuredMessageClass {
  ITALIC = 'italic',
  BOLD = 'bold',
  NORMAL_TEXT = 'normal-text',
  HEADING_1 = 'heading1',
  HEADING_2 = 'heading2',
  HEADING_3 = 'heading3',
}

export type StructuredMessageFileField = {
  type: StructuredMessageFieldType.FILE
  id: string
  filename: string
  mediaType: string
  url?: string
}

export type StructuredMessageField = (
  | {
      type:
        | StructuredMessageFieldType.TEXT
        | StructuredMessageFieldType.DATE
        | StructuredMessageFieldType.TIME
        | StructuredMessageFieldType.PHONE
      value: string
    }
  | {
      type: StructuredMessageFieldType.MONEY
      amount: number
      currency: string
    }
  | {
      type: StructuredMessageFieldType.BOOLEAN
      value: boolean
    }
  | StructuredMessageFileField
) & { classes?: StructuredMessageClass[] }

export type StructuredMessageContainer = {
  type:
    | StructuredMessageContainerType.HBOX
    | StructuredMessageContainerType.VBOX
  content: (StructuredMessageContainer | StructuredMessageField)[]
  spacing?: {
    value: number
    unit: 'rem' | 'px'
  }
  classes?: StructuredMessageClass[]
}

export type StructuredMessage = {
  message: StructuredMessageContainer
  files: StructuredMessageFiles
}

export type StructuredMessagePayload = {
  type: PayloadType.STRUCTURE
  content: StructuredMessageContainer
}
