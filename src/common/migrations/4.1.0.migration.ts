import { AppStore } from '../store'

export function migrate410(store: AppStore) {
  if (store.get('mo2.mods') !== 'mods') {
    store.set('mo2.mods', 'mods')
  }
}
