export enum ValidationErrorMessageType {
  /**
   * Builtin (Yup) error
   */
  Builtin = 'BUILTIN',

  /**
   * App (custom) error
   */
  App = 'APP',
}

export type ValidationErrorMessage = {
  type: ValidationErrorMessageType
  text?: string
}
