import { Brand } from 'effect'

export type KeyboardShortcut = string & Brand.Brand<'KeyboardShortcut'>

export const KeyboardShortcut = Brand.nominal<KeyboardShortcut>()
