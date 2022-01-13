import { Header, Popup, Calendar } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'

type CalendarPopupProps = {
  defaultValue: Date
  title: string
  from: Date
  to: Date
  onDateChange: (date: Date) => void
}

export const CalendarPopup: ModalComponent<CalendarPopupProps> = ({
  defaultValue,
  isOpen,
  title,
  from,
  to,
  onDateChange,
  onRequestClose,
}) => {
  const handleDateChange = (date?: Date | null) => {
    if (date) {
      onDateChange(date)
    }

    onRequestClose()
  }

  return (
    <Popup isOpen={isOpen} onExit={onRequestClose} variant="bottom-sheet">
      <Header variant="bottom-sheet">
        <Header.Title>{title}</Header.Title>
      </Header>
      <Calendar
        variant="month"
        defaultValue={defaultValue}
        disabledDays={{ before: from, after: to }}
        hideHeader
        onChange={handleDateChange}
      />
    </Popup>
  )
}
