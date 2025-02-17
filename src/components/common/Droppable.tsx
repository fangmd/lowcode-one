import React from "react"
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core"
import clsx from "clsx"

interface DroppableProps {
  id: UniqueIdentifier
  children: React.ReactNode
}

export const Droppable = (props: DroppableProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })

  console.log("isOver", isOver)

  const bgCN = isOver ? "bg-green-300" : undefined

  return (
    <div ref={setNodeRef} className={clsx("w-full, h-full", bgCN)}>
      {props.children}
    </div>
  )
}
