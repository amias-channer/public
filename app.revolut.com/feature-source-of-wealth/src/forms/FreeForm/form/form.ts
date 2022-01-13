import { head, last, isEmpty } from 'lodash'
import * as Yup from 'yup'

import { checkRequired } from '@revolut/rwa-core-utils'

import { FormSchemeComponent, FormInfo } from 'hooks'

import { TextArea, RadioSelect } from '../../../components'
import { FormStateAction, FormStateDefinition } from '../../../hooks'
import {
  SOWAnswerType,
  SOWQuestionType,
  SOWQuestionTypeType,
} from '../../../types/generated/sow'
import { createQuestionOptions } from '../../../utils'

const COMPONENTS_MAP = {
  [SOWAnswerType.Select]: RadioSelect,
  [SOWAnswerType.Text]: TextArea,
}

type Form = {
  validations: Yup.ObjectSchema
  formState: FormStateDefinition<SOWQuestionTypeType>
  form: Record<SOWQuestionTypeType, FormSchemeComponent<SOWQuestionTypeType>>
  formInfo: FormInfo<SOWQuestionTypeType>
}

const initialData = {
  validations: Yup.object(),
  formState: {
    initialState: undefined,
    states: {},
  },
  form: {},
  formInfo: {},
} as Form

const createForm = (questions: SOWQuestionType[]) => {
  const initialState = checkRequired(head(questions)?.question, 'Questions should exist')
  const endState = checkRequired(last(questions)?.question, 'Questions should exist')

  return questions.reduce((accum, question, index) => {
    const name = checkRequired(question.question, 'Question of free form is not found')
    const type = checkRequired(question.type, 'Question of free form is not found')
    const options = createQuestionOptions(question?.valueToTitle ?? {})

    const isRequired = question?.isRequired
    const isFirst = initialState === name
    const isLast = endState === name

    return {
      validations: accum.validations.concat(
        Yup.object({
          [name]: isRequired
            ? Yup.string().required('Answer is required').min(3).max(255)
            : Yup.string().notRequired().min(3).max(255),
        }),
      ),
      formState: {
        initialState,
        states: {
          ...accum.formState.states,
          [name]: {
            actions: {
              [FormStateAction.Forward]: isLast
                ? {}
                : {
                    target: questions[index + 1].question,
                  },
              [FormStateAction.Back]: isFirst
                ? {}
                : {
                    target: questions[index - 1].question,
                  },
            },
          },
        },
      },
      form: {
        ...accum.form,
        [name]: {
          name,
          Component: COMPONENTS_MAP[type],
          props: {
            options,
          },
        },
      },
      formInfo: {
        ...accum.formInfo,
        [name]: {
          title: question.title,
          description: question.description,
          label: question.fieldName,
          isLast,
        },
      },
    }
  }, initialData as Form)
}

export const getFreeForm = (questions: SOWQuestionType[]) => {
  if (isEmpty(questions)) {
    return initialData
  }

  return createForm(questions)
}
