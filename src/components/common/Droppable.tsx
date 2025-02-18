import React, { useRef, useEffect, useState } from "react"
import clsx from "clsx"
import invariant from "tiny-invariant"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"

interface DroppableProps {
  id: string
  children: React.ReactNode
  data?: any
  className?: string
}

type HoveredState = "idle" | "validMove" | "invalidMove"

export const Droppable = (props: DroppableProps) => {
  const ref = useRef(null)
  const [state, setState] = useState<HoveredState>("idle")
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        return attachClosestEdge(props.data, {
          input,
          element,
          allowedEdges: ["top", "bottom"],
        })
      },
      onDragEnter: ({ source, self }) => {
        console.log("source", source)

        if (source.data.key !== self.data.key) {
          setClosestEdge(extractClosestEdge(self.data))
        }

        setState("validMove")
      },
      onDrag: ({ source, self }) => {
        if (source.data.key !== self.data.key) {
          setClosestEdge(extractClosestEdge(self.data))
        }
      },
      onDragLeave: () => {
        setState("idle")
        setClosestEdge(null)
      },
      onDrop: () => {
        setState("idle")
        setClosestEdge(null)
      },
    })
  }, [props.data])

  const draggedOverCN = state === "validMove" ? "bg-green-300" : undefined

  return (
    <div
      ref={ref}
      className={clsx("w-fit h-fit relative", draggedOverCN, props.className)}
    >
      {props.children}
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>
  )
}
