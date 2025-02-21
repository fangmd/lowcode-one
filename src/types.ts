/** schema type */
export interface SchemaItem {
  key: string
  color?: string
}

export interface JSONSchema {
  id: string
  type: string
  children?: JSONSchema[]
  [key: string]: any
}
