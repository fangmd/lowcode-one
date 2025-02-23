import invariant from "tiny-invariant"
import { type Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item"

export type TreeItem = {
  id: string
  children: TreeItem[]
}

export type TreeAction =
  | {
      type: "instruction"
      instruction: Instruction
      itemId: string
      targetId: string
    }
  | {
      type: "toggle"
      itemId: string
    }
  | {
      type: "expand"
      itemId: string
    }
  | {
      type: "collapse"
      itemId: string
    }
  | { type: "modal-move"; itemId: string; targetId: string; index: number }

export const tree = {
  remove(data: TreeItem[], id: string): TreeItem[] {
    return data
      .filter((item) => item.id !== id)
      .map((item) => {
        if (tree.hasChildren(item)) {
          return {
            ...item,
            children: tree.remove(item.children, id),
          }
        }
        return item
      })
  },
  insertBefore(
    data: TreeItem[],
    targetId: string,
    newItem: TreeItem
  ): TreeItem[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        return [newItem, item]
      }
      if (tree.hasChildren(item)) {
        return {
          ...item,
          children: tree.insertBefore(item.children, targetId, newItem),
        }
      }
      return item
    })
  },
  insertAfter(
    data: TreeItem[],
    targetId: string,
    newItem: TreeItem
  ): TreeItem[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        return [item, newItem]
      }

      if (tree.hasChildren(item)) {
        return {
          ...item,
          children: tree.insertAfter(item.children, targetId, newItem),
        }
      }

      return item
    })
  },
  insertChild(
    data: TreeItem[],
    targetId: string,
    newItem: TreeItem
  ): TreeItem[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        // already a parent: add as first child
        return {
          ...item,
          // opening item so you can see where item landed
          isOpen: true,
          children: [newItem, ...item.children],
        }
      }

      if (!tree.hasChildren(item)) {
        return item
      }

      return {
        ...item,
        children: tree.insertChild(item.children, targetId, newItem),
      }
    })
  },
  find(data: TreeItem[], itemId: string): TreeItem | undefined {
    for (const item of data) {
      if (item.id === itemId) {
        return item
      }

      if (tree.hasChildren(item)) {
        const result = tree.find(item.children, itemId)
        if (result) {
          return result
        }
      }
    }
  },
  getPathToItem({
    current,
    targetId,
    parentIds = [],
  }: {
    current: TreeItem[]
    targetId: string
    parentIds?: string[]
  }): string[] | undefined {
    for (const item of current) {
      if (item.id === targetId) {
        return parentIds
      }
      const nested = tree.getPathToItem({
        current: item.children,
        targetId: targetId,
        parentIds: [...parentIds, item.id],
      })
      if (nested) {
        return nested
      }
    }
  },
  insert(data: TreeItem[], item: TreeItem): TreeItem[] {
    return [...data, item]
  },
  hasChildren(item: TreeItem): boolean {
    return item.children?.length > 0
  },
}

export const treeAction = (data: TreeItem[], action: TreeAction) => {
  const item = tree.find(data, action.itemId)
  if (!item) {
    return data
  }

  if (action.type === "instruction") {
    const instruction = action.instruction

    if (instruction.type === "reparent") {
      const path = tree.getPathToItem({
        current: data,
        targetId: action.targetId,
      })
      invariant(path)
      const desiredId = path[instruction.desiredLevel]
      let result = tree.remove(data, action.itemId)
      result = tree.insertAfter(result, desiredId, item)
      return result
    }

    // the rest of the actions require you to drop on something else
    if (action.itemId === action.targetId) {
      return data
    }

    if (instruction.type === "reorder-above") {
      let result = tree.remove(data, action.itemId)
      result = tree.insertBefore(result, action.targetId, item)
      return result
    }

    if (instruction.type === "reorder-below") {
      let result = tree.remove(data, action.itemId)
      result = tree.insertAfter(result, action.targetId, item)
      return result
    }

    if (instruction.type === "make-child") {
      let result = tree.remove(data, action.itemId)
      result = tree.insertChild(result, action.targetId, item)
      return result
    }

    console.warn("TODO: action not implemented", instruction)

    return data
  }

  // 处理其他 type
}

export const treeInsert = (
  data: TreeItem[],
  newData: TreeItem,
  action: TreeAction
) => {
  if (action.type !== "instruction") {
    return data
  }

  const instruction = action?.instruction

  if (instruction.type === "reorder-above") {
    const result = tree.insertBefore(data, action.targetId, newData)
    return result
  }

  if (instruction.type === "reorder-below") {
    const result = tree.insertAfter(data, action.targetId, newData)
    return result
  }

  if (instruction.type === "make-child") {
    const result = tree.insertChild(data, action.targetId, newData)
    return result
  }
}
