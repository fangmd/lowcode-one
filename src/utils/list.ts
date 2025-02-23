import { JSONSchema } from "../types"

export const list = {
  insertBefore(
    data: JSONSchema[],
    targetId: string,
    newItem: JSONSchema
  ): JSONSchema[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        return [newItem, item]
      }
      if (list.hasChildren(item)) {
        return {
          ...item,
          children: list.insertBefore(item.children!, targetId, newItem),
        }
      }
      return item
    })
  },
  insertAfter(
    data: JSONSchema[],
    targetId: string,
    newItem: JSONSchema
  ): JSONSchema[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        return [item, newItem]
      }

      if (list.hasChildren(item)) {
        return {
          ...item,
          children: list.insertAfter(item.children!, targetId, newItem),
        }
      }

      return item
    })
  },
  hasChildren(item: JSONSchema): boolean {
    if (!item.children) return false
    return item.children.length > 0
  },
}
