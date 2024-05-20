import _ from 'lodash'
import { StorageManager } from './StorageManager.tsx'

export abstract class AbstractStorageManager implements Partial<StorageManager> {
  private readonly listeners: (() => void)[] = []

  private _isStoragePersistent = false

  protected setIsStoragePersistent = (isStoragePersistent: boolean): void => {
    this._isStoragePersistent = isStoragePersistent
    this.fireListeners()
  }

  get isStoragePersistent(): boolean {
    return this._isStoragePersistent
  }

  addListener = (listener: () => void): void => {
    this.listeners.push(listener)
  }

  removeListener = (listener: () => void): void => {
    _.remove(this.listeners, (l) => l === listener)
  }

  protected fireListeners = (): void => {
    for (const listener of this.listeners) {
      listener()
    }
  }
}
