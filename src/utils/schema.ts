import { JSONSchema } from "../types"
import {
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import {
  attachInstruction,
  extractInstruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item"
import { treeAction, treeInsert, TreeItem } from "./tree"
import { list } from "./list"

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

  let ret
  // if (target.isGroup) {
  const instruction = extractInstruction(target as any)
  console.log("instruction", instruction)
  console.log("insertItem", source)

  const { component, ...rest } = source

  if (instruction?.type === "instruction-blocked") {
    return schema
  }

  ret = treeInsert(schema as TreeItem[], rest as TreeItem, {
    type: "instruction",
    instruction: instruction as any,
    itemId: source.id,
    targetId: target.id,
  })
  // } else {
  //   const edge = extractClosestEdge(target as any)
  //   console.log("edge", edge)

  //   if (edge === "top") {
  //     ret = list.insertBefore(schema, target.id, source)
  //   } else if (edge === "bottom") {
  //     ret = list.insertAfter(schema, target.id, source)
  //   }
  // }

  return ret
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

  const instruction = extractInstruction(target as any)
  console.log("instruction", instruction)
  console.log("insertItem", source)
  const ret = treeAction(schema as TreeItem[], {
    type: "instruction",
    instruction: instruction as any,
    itemId: source.id,
    targetId: target.id,
  })

  return ret
}
