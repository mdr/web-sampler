import { Brand } from 'effect'

export type TestId = string & Brand.Brand<'TestId'>

export const TestId = Brand.nominal<TestId>()
