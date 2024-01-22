import { Brand } from 'effect'

export type Url = string & Brand.Brand<'Url'>

export const Url = Brand.nominal<Url>()
