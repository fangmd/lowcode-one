import React, { useRef, useEffect, useState } from "react"
import clsx from "clsx"
import invariant from "tiny-invariant"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/tree-item"
import {
  attachInstruction,
  extractInstruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item"
import { indentPerLevel } from "./constants"
import {
  type Instruction,
  type ItemMode,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item"
import { DropIndicator as BoxDropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"

interface DroppableProps {
  id: string
  children: React.ReactNode
  data?: any
  className?: string
  mode: ItemMode
}

type HoveredState = "idle" | "validMove" | "invalidMove"

export const Droppable = (props: DroppableProps) => {
  const ref = useRef(null)
  const [state, setState] = useState<HoveredState>("idle")
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)
  const [instruction, setInstruction] = useState<Instruction | null>(null)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        return attachInstruction(props.data, {
          input,
          element,
          indentPerLevel,
          currentLevel: 0,
          mode: props.mode,
          block: props.data.isGroup ? [] : ["make-child"],
        })
      },
      onDragEnter: ({ source, self }) => {
        console.log("onDragEnter source", source)

        if (source.data.id !== self.data.id) {
          const instruction = extractInstruction(self.data)
          // console.log("instruction", instruction)
          setInstruction(instruction)
          // if (self.data.isGroup) {
          //   const instruction = extractInstruction(self.data)
          //   // console.log("instruction", instruction)
          //   setInstruction(instruction)
          // } else {
          //   setClosestEdge(extractClosestEdge(self.data))
          // }
        }

        setState("validMove")
      },
      onDrag: ({ source, self }) => {
        if (source.data.id !== self.data.id) {
          // if (self.data.isGroup) {
            const instruction = extractInstruction(self.data)
            setInstruction(instruction)
          // } else {
          //   setClosestEdge(extractClosestEdge(self.data))
          // }
        }
      },
      onDragLeave: () => {
        setState("idle")
        setInstruction(null)
        setClosestEdge(null)
      },
      onDrop: () => {
        setState("idle")
        setInstruction(null)
        setClosestEdge(null)
      },
    })
  }, [props.data, props.mode])

  const draggedOverCN = state === "validMove" ? "bg-green-300" : undefined

  return (
    <div
      ref={ref}
      className={clsx("w-fit h-fit relative", draggedOverCN, props.className)}
    >
      {props.children}
      {instruction && <DropIndicator instruction={instruction} />}
      {closestEdge && <BoxDropIndicator edge={closestEdge} />}
    </div>
  )
}
