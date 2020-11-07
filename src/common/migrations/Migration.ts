import { AppStore } from '../appStore'

export interface Migration {
  migrate(store: AppStore): number
}
