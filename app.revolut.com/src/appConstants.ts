import * as Controls from './FlowPage/Controls'

export enum Route {
  Flow = '/:flowId',
  NotFound = '/not-found',
  NoCamera = '/no-camera',
}

export enum FlowState {
  Complete = 'COMPLETE',
  Incomplete = 'INCOMPLETE',
}

export enum UploadState {
  Uploading = 'UPLOADING',
  UploadFailed = 'UPLOAD_FAILED',
}

export enum FlowViewType {
  Form = 'FORM',
  DeepLink = 'DEEPLINK',
}

export enum FlowViewItemType {
  CameraImage = 'CAMERA_IMAGE',
  CardInput = 'CARD_INPUT',
  DateInput = 'DATE_INPUT',
  Document = 'DOCUMENT',
  FilesUpload = 'FILES_UPLOAD',
  Image = 'IMAGE',
  MoneyInput = 'MONEY_INPUT',
  MultiChoice = 'MULTI_CHOICE',
  PhoneInput = 'PHONE_INPUT',
  SingleChoice = 'SINGLE_CHOICE',
  SingleChoiceTextInput = 'SINGLE_CHOICE_TEXT_INPUT',
  StarRatingInput = 'STAR_RATING_INPUT',
  TextInfo = 'TEXT',
  TextInput = 'TEXT_INPUT',
  TimeInput = 'TIME_INPUT',
  YesNoInput = 'YES_NO_INPUT',
  CountryInput = 'COUNTRY_SELECTION',
  CurrencyInput = 'CURRENCY_SELECTION',
  // Legacy:
  Chooser = 'CHOOSER',
}

export enum CameraImageSource {
  Rear = 'REAR',
  Front = 'FRONT',
}

export enum FlowViewItemImageContent {
  Lottie = 'LOTTIE',
  Static = 'STATIC',
}

export enum TextStyle {
  PrimaryText = 'PRIMARY_TEXT',
  GroupHeader = 'GROUP_HEADER',
}

export enum FooterType {
  HTMLString = 'HTML_STRING',
}

export const REVOLUT_WEBSITE = 'https://revolut.com'

export const staticItemTypes: Readonly<Array<FlowViewItemType>> = [
  FlowViewItemType.Document, // Can be dynamic (with value)
  FlowViewItemType.Image,
  FlowViewItemType.TextInfo,
]

export const combinedItemTypes: Readonly<Array<FlowViewItemType>> = [
  FlowViewItemType.MultiChoice,
  FlowViewItemType.SingleChoice,
  FlowViewItemType.SingleChoiceTextInput,
]

export const fullWidthItemType: Readonly<Array<FlowViewItemType>> = [
  FlowViewItemType.CameraImage,
  FlowViewItemType.FilesUpload,
  FlowViewItemType.Image,
  FlowViewItemType.TextInfo,
]

export const mapItemTypeToElement = {
  [FlowViewItemType.CameraImage]: Controls.FilesUpload,
  [FlowViewItemType.CardInput]: Controls.CardInput,
  [FlowViewItemType.Chooser]: Controls.Chooser,
  [FlowViewItemType.DateInput]: Controls.DateInput,
  [FlowViewItemType.FilesUpload]: Controls.FilesUpload,
  [FlowViewItemType.Image]: Controls.Image,
  [FlowViewItemType.MoneyInput]: Controls.MoneyInput,
  [FlowViewItemType.MultiChoice]: Controls.MultiChoice,
  [FlowViewItemType.PhoneInput]: Controls.PhoneInput,
  [FlowViewItemType.SingleChoice]: Controls.SingleChoice,
  [FlowViewItemType.StarRatingInput]: Controls.StarRatingInput,
  [FlowViewItemType.TextInfo]: Controls.TextInfo,
  [FlowViewItemType.TextInput]: Controls.TextInput,
  [FlowViewItemType.TimeInput]: Controls.TimeInput,
  [FlowViewItemType.YesNoInput]: Controls.YesNoInput,
  [FlowViewItemType.CountryInput]: Controls.CountryInput,
  [FlowViewItemType.CurrencyInput]: Controls.CurrencyInput,
}
