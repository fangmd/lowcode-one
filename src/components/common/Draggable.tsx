import React, { useRef, useEffect, useState } from "react"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import invariant from "tiny-invariant"
import clsx from "clsx"

interface DraggableProps {
  id: string
  children: React.ReactNode
  data?: any
}

export const Draggable = (props: DraggableProps) => {
  const ref = useRef(null)
  const [dragging, setDragging] = useState<boolean>(false)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return draggable({
      element: el,
      getInitialData: () => props.data,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [props.data])

  return (
    <div
      ref={ref}
      className={clsx(
        "w-fit h-fit box-border border-1 ",
        dragging ? "border-1 border-black-500" : "border-transparent"
      )}
    >
      {props.children}
    </div>
  )
}
