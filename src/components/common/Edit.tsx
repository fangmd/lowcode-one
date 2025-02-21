import React from "react"
import { Draggable } from "./Draggable"
import { Droppable } from "./Droppable"

interface EditProps {
  children: React.ReactNode
  data?: any
  className?: string
}

export const Edit = ({ children, data, className }: EditProps) => {
  const id = data?.id

  return (
    <Draggable id={id} data={data} className={className}>
      <Droppable id={id} data={data} className={className}>
        {children}
      </Droppable>
    </Draggable>
  )
}
