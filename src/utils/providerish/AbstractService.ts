import { Draft, produce } from 'immer'

export type StateChangedListener = () => void

export class AbstractService<State> {
  private readonly listeners: StateChangedListener[] = []

  private _state: State

  constructor(initialState: State) {
    this._state = initialState
  }

  get state(): State {
    return this._state
  }

  protected set state(value: State) {
    this._state = value
    this.fireListeners()
  }

  protected setState = (state: Partial<State>): void => {
    this.state = { ...this.state, ...state }
  }

  protected updateState = (update: (draft: Draft<State>) => void): void => {
    this.state = produce(this.state, update)
  }

  addListener = (listener: StateChangedListener): void => {
    this.listeners.push(listener)
  }

  removeListener = (listener: StateChangedListener): void => {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
  }

  private fireListeners = (): void => this.listeners.forEach((listener) => listener())
}
