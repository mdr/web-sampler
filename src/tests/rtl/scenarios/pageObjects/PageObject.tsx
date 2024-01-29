import { TestContext } from './TestContext.tsx'

export abstract class PageObject {
  constructor(protected readonly testContext: TestContext) {}
}
