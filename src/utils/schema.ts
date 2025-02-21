import { JSONSchema } from "../types"
import {
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge"

const loopFind = (schema: JSONSchema[], id: string) => {
  for (let i = 0; i < schema.length; i++) {
    const item = schema[i]
    if (item.id === id) {
      return item
    }
    if (item.children?.length) {
      const result = loopFind(item.children, id)
      if (result) {
        return result
      }
    }
  }
  return null
}

const loopFindParent = (
  schema: JSONSchema[],
  id: string
): JSONSchema | null => {
  for (let i = 0; i < schema.length; i++) {
    const item = schema[i]
    if (item.children?.length) {
      for (let j = 0; j < item.children.length; j++) {
        if (item.children[j].id === id) {
          return item
        }
      }
      const result = loopFindParent(item.children, id)
      if (result) {
        return result
      }
    }
  }
  return null
}

export const mInsertItem = (
  schema: JSONSchema[],
  target: JSONSchema,
  source: JSONSchema
) => {
  const targetItem = loopFind(schema, target.id)
  if (!targetItem) return schema

  const closestEdgeOfTarget = extractClosestEdge(target as any)
  console.log("closestEdgeOfTarget", closestEdgeOfTarget)
  console.log("insertItem", source)

  const { component, ...rest } = source

  targetItem.children.push(rest)
  return schema
}

export const mReorderItem = (
  schema: JSONSchema[],
  target: JSONSchema,
  source: JSONSchema
) => {
  const targetItem = loopFind(schema, target.id)
  const targetParentItem = loopFindParent(schema, target.id)
  const sourceParentItem = loopFindParent(schema, source.id)
  if (!targetItem) return schema
  if (!sourceParentItem) return []

  const { component, ...rest } = source

  const closestEdgeOfTarget = extractClosestEdge(target as any)

  // 同级别
  if (targetParentItem?.id === sourceParentItem.id) {
    targetParentItem.children = reorderWithEdge({
      axis: "vertical",
      list: targetParentItem.children!,
      startIndex: targetParentItem.children!.findIndex(
        (item) => item.id === source.id
      ),
      indexOfTarget: targetParentItem.children!.findIndex(
        (item) => item.id === target.id
      ),
      closestEdgeOfTarget: closestEdgeOfTarget,
    })
  }

  // 不同级别
  if (targetParentItem?.id !== sourceParentItem.id) {
    // remove item
    sourceParentItem.children = sourceParentItem.children?.filter(
      (item) => item.id !== source.id
    )

    // TODO: 插入到 target 的 children 中

    if (!targetItem.children) {
      targetItem.children = []
    }

    if (closestEdgeOfTarget === "bottom") {
      targetItem.children.push(rest)
    } else if (closestEdgeOfTarget === "top") {
      targetItem.children.unshift(rest)
    }
  }

  return schema
}
