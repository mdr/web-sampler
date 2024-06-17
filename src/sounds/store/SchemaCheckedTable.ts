import { Table } from 'dexie'
import { ZodTypeAny } from 'zod'

export class SchemaCheckedTable<T, TKey> {
  constructor(
    readonly dexieTable: Table<T, TKey>,
    private readonly schema: ZodTypeAny,
  ) {}

  private parse = (item: unknown): T => this.schema.parse(item) as T

  toArray = async (): Promise<T[]> => {
    const items = await this.dexieTable.toArray()
    return items.map(this.parse)
  }

  bulkPut = async (items: T[]): Promise<void> => {
    await this.dexieTable.bulkPut(items)
  }

  bulkDelete = async (keys: TKey[]): Promise<void> => {
    await this.dexieTable.bulkDelete(keys)
  }
}
