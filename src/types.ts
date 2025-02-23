/** schema type */
export interface SchemaItem {
  key: string
  color?: string
}

export interface JSONSchema {
  id: string
  type: string
  isGroup?: boolean // 是否是容器组件
  children?: JSONSchema[]
  [key: string]: any
}
