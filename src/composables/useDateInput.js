import { computed } from 'vue'
import { useDate } from 'vuetify'

export const useDateInput = (date, formatType = 'fullDate') => {
  const adapter = useDate()
  const today = adapter.date()

  const inputDate = computed({
    get() {
      return date.value ? adapter.parseISO(date.value) : null
    },
    set(value) {
      date.value = value ? adapter.toISO(value) : null
    },
  })

  const formatDate = (value) => adapter.format(value, formatType)

  return {
    inputDate,
    today,
    formatDate,
  }
}
