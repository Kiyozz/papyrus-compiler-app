import { format as formatDate } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function format(item: number | Date, formatModel: string): string {
  return formatDate(item, formatModel, { locale: enUS })
}
