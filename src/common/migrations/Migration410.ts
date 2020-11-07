import type { AppStore } from '@common'
import type { Migration } from './Migration'

export class Migration410 implements Migration {
  migrate(store: AppStore): number {
    store.set('mo2.mods', 'mods')

    return 0
  }
}
