import type { AppStore } from '@common'

export interface Migration {
  migrate(store: AppStore): number
}
