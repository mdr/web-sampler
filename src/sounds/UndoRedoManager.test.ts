import { describe, expect, it } from 'vitest'
import { UndoRedoManager } from './UndoRedoManager.ts'

describe('UndoRedoManager', () => {
  it('should manage state and undo / redo actions', () => {
    const undoRedoManager = new UndoRedoManager<number>(0)
    expect(undoRedoManager.getCurrentState()).toEqual(0)

    undoRedoManager.change(1)
    expect(undoRedoManager.getCurrentState()).toEqual(1)

    undoRedoManager.change(2)
    expect(undoRedoManager.getCurrentState()).toEqual(2)

    undoRedoManager.undo()
    expect(undoRedoManager.getCurrentState()).toEqual(1)

    undoRedoManager.redo()
    expect(undoRedoManager.getCurrentState()).toEqual(2)
  })

  it('should do nothing if nothing to undo', () => {
    const undoRedoManager = new UndoRedoManager<number>(0)

    undoRedoManager.undo()

    expect(undoRedoManager.getCurrentState()).toEqual(0)
  })

  it('should do nothing if nothing to redo', () => {
    const undoRedoManager = new UndoRedoManager<number>(0)

    undoRedoManager.redo()

    expect(undoRedoManager.getCurrentState()).toEqual(0)
  })
})
