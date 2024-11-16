import { expect, it, vi } from 'vitest'

import { Pcm } from '../../utils/types/brandedTypes.ts'
import { doNothing } from '../../utils/utils.ts'
import { STOP_MESSAGE } from './CapturingAudioWorkletConstants.ts'
import { CapturingAudioWorkletProcessorImplementation } from './CapturingAudioWorkletProcessorImplementation.ts'

it('should forward samples it receives to its message port', () => {
  const worklet = new CapturingAudioWorkletProcessorImplementation()
  const messagePort = makeMessagePort()
  worklet.initialize(messagePort)
  const samples = Pcm(SAMPLES)

  const forceRemainActive = worklet.process(messagePort, [[samples]])

  expect(forceRemainActive).toBe(true)
  expect(messagePort.postMessage).toHaveBeenCalledWith(samples)
})

it('should clamp samples to the range -1 to 1', () => {
  const worklet = new CapturingAudioWorkletProcessorImplementation()
  const messagePort = makeMessagePort()
  worklet.initialize(messagePort)
  const samples = Pcm(new Float32Array([-2, -1.0001, -1, 1, 1.0001, 2]))

  worklet.process(messagePort, [[samples]])

  expect(messagePort.postMessage).toHaveBeenCalledWith(Pcm(new Float32Array([-1, -1, -1, 1, 1, 1])))
})

it('should stop processing when it receives a stop message', () => {
  const worklet = new CapturingAudioWorkletProcessorImplementation()
  const messagePort = makeMessagePort()
  worklet.initialize(messagePort)
  const samples = Pcm(SAMPLES)

  messagePort.onmessage?.(makeMessageEvent(STOP_MESSAGE))
  const forceRemainActive = worklet.process(messagePort, [[samples]])

  expect(forceRemainActive).toBe(false)
  expect(messagePort.postMessage).not.toHaveBeenCalled()
})

const makeMessagePort = (): MessagePort =>
  ({
    postMessage: vi.fn(),
    onmessage: doNothing,
  }) as unknown as MessagePort

const makeMessageEvent = (data: unknown): MessageEvent =>
  ({
    data,
  }) as unknown as MessageEvent

const SAMPLES = Pcm(new Float32Array([-1, -0.5, 0, 0.5, 1]))
