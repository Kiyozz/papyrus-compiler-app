import type { AppStore } from '@common'
import type { Migration } from './Migration'

export class Migration410 implements Migration {
  migrate(store: AppStore): number {
    if (store.get('mo2.mods') !== 'mods') {
      store.set('mo2.mods', 'mods')
    }

    return 0
  }
}
