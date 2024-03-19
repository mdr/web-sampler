import { SoundState } from './SoundState.ts'
import { Option } from '../utils/types/Option.ts'

export class UndoRedoManager {
  private undoStack: SoundState[] = []
  private currentState: SoundState = { sounds: [] }
  private redoStack: SoundState[] = []

  initialise = (state: SoundState) => {
    this.currentState = state
    this.undoStack.length = 0
    this.redoStack.length = 0
  }

  getCurrentState = (): SoundState => this.currentState

  change = (state: SoundState) => {
    this.undoStack.push(this.currentState)
    this.currentState = state
    this.redoStack.length = 0
  }

  undo = (): Option<SoundState> => {
    const previousState = this.undoStack.pop()
    if (previousState === undefined) {
      return undefined
    }
    this.redoStack.push(this.currentState)
    this.currentState = previousState
    return previousState
  }

  redo = (): Option<SoundState> => {
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
