import { Option } from '../utils/types/Option.ts'

export class UndoRedoManager<T> {
  private undoStack: T[] = []
  private currentState: T
  private redoStack: T[] = []

  constructor(initialState: T) {
    this.currentState = initialState
  }

  initialise = (state: T) => {
    this.currentState = state
    this.undoStack.length = 0
    this.redoStack.length = 0
  }

  getCurrentState = (): T => this.currentState

  change = (state: T) => {
    this.undoStack.push(this.currentState)
    this.currentState = state
    this.redoStack.length = 0
  }

  undo = (): Option<T> => {
    const previousState = this.undoStack.pop()
    if (previousState === undefined) {
      return undefined
    }
    this.redoStack.push(this.currentState)
    this.currentState = previousState
    return previousState
  }

  redo = (): Option<T> => {
    const nextState = this.redoStack.pop()
    if (nextState === undefined) {
      return undefined
    }
    this.undoStack.push(this.currentState)
    this.currentState = nextState
    return nextState
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0
  }
}
