import { fireAndForget } from '../utils/utils.ts'
import _ from 'lodash'

export interface StorageManagerState {
  readonly isStoragePersistent: boolean
}

export interface StorageManagerActions {
  attemptToMakeStoragePersistent(): Promise<boolean>
}

export interface StorageManager extends StorageManagerState, StorageManagerActions {
  addListener(listener: () => void): void

  removeListener(listener: () => void): void
}

export class WebStorageManager implements StorageManager {
  private _isStoragePersistent = false
  private readonly listeners: (() => void)[] = []

  addListener = (listener: () => void): void => {
    this.listeners.push(listener)
  }

  removeListener = (listener: () => void): void => {
    _.remove(this.listeners, (l) => l === listener)
  }

  private fireListeners = (): void => {
    for (const listener of this.listeners) {
      listener()
    }
  }

  constructor() {
    fireAndForget(async () => {
      this.setIsStoragePersistent(await navigator.storage.persisted())
    })
  }

  private setIsStoragePersistent = (isStoragePersistent: boolean): void => {
    this._isStoragePersistent = isStoragePersistent
    this.fireListeners()
  }

  get isStoragePersistent(): boolean {
    return this._isStoragePersistent
  }

  attemptToMakeStoragePersistent = async (): Promise<boolean> => {
    const isStoragePersistent = await navigator.storage.persist()
    this.setIsStoragePersistent(isStoragePersistent)
    return isStoragePersistent
  }
}
