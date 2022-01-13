import { VFC } from 'react'
import { ExpandableCell } from '@revolut/ui-kit'

type Props = {
  title: string
  note: string
  content: string
}

export const ExpandableDetails: VFC<Props> = ({ title, content, note }) => (
  <ExpandableCell>
    <ExpandableCell.Title>{title}</ExpandableCell.Title>
    <ExpandableCell.Content>{content}</ExpandableCell.Content>
    <ExpandableCell.Note>{note}</ExpandableCell.Note>
  </ExpandableCell>
)
