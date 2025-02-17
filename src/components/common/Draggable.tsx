import React from "react"
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core"

interface DraggableProps {
  id: UniqueIdentifier
  children: React.ReactNode
  data?: any
}

export const Draggable = (props: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: props.data,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  )
}
