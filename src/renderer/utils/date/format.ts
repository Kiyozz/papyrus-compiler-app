import { format as formatDate } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import i18n from 'i18next'

export function format(item: number | Date, formatModel: string): string {
  let locale = enUS

  switch (i18n.language) {
    case 'fr':
      locale = fr
      break
    case 'en':
      locale = enUS
      break
  }

  return formatDate(item, formatModel, { locale })
}
