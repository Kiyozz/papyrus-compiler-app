import { AppStore } from '../store'

export interface Migration {
  migrate(store: AppStore): number
}
