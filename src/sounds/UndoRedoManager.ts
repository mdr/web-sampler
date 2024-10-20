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

  private moveState = (fromStack: T[], toStack: T[]): Option<T> => {
    const newState = fromStack.pop()
    if (newState === undefined) return undefined
    toStack.push(this.currentState)
    this.currentState = newState
    return newState
  }

  undo = (): Option<T> => this.moveState(this.undoStack, this.redoStack)

  redo = (): Option<T> => this.moveState(this.redoStack, this.undoStack)

  get canUndo(): boolean {
    return this.undoStack.length > 0
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0
  }
}
