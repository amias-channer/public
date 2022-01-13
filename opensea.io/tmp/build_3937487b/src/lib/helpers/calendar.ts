import moment from "moment"

function formatDate(date: moment.Moment) {
  return date.format("YYYYMMDDTHHmmssZ").replace("+00:00", "Z")
}

export function buildCalendarUrl(
  title: string,
  text: string,
  location: string,
  startDate: moment.Moment,
  endDate?: moment.Moment,
) {
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${text}&dates=${formatDate(
    startDate,
  )}%2F${endDate ? formatDate(endDate) : formatDate(startDate.add(1, "hour"))}`
}
