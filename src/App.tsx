import { Box } from "./components/Box"
import { Droppable } from "./components/common/Droppable"
import { Draggable } from "./components/common/Draggable"
import { useCallback, useEffect, useState } from "react"
import { genUUID } from "./utils"
import { SchemaItem } from "./types"
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"

function App() {
  const [jsonSchema, setJsonSchema] = useState<SchemaItem[]>([
    { key: "-", color: "bg-red-500" },
  ]) // JSON Schema
  const [activeItem, setActiveItem] = useState<SchemaItem | null>(null)

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number
      indexOfTarget: number
      closestEdgeOfTarget: Edge | null
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      })

      console.log("finishIndex", finishIndex)

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return
      }

      setJsonSchema((prev) => {
        return reorder({ list: prev, startIndex, finishIndex })
      })
    },
    []
  )

  useEffect(() => {
    return monitorForElements({
      onDrag: ({ source }) => {
        console.log("monitorForElements onDrag", { source })
        setActiveItem(source.data as any)
      },
      onDrop({ source, location }) {
        console.log("monitorForElements", { source, location })
        const destination = location.current.dropTargets[0]
        if (!destination) {
          return
        }

        const destinationData = destination.data
        const sourceData = source.data

        const newItem = { ...sourceData }

        // 从物料区拖动到画布区，新增
        if (sourceData.isSource) {
          newItem.key = genUUID()
          delete newItem.isSource
          setJsonSchema((prev) => [...prev, newItem as any])
        }

        // 从画布区拖动到画布区，修改位置
        if (!destinationData.isSource) {
          const indexOfSource = jsonSchema.findIndex(
            (item) => item.key === sourceData.key
          )

          const indexOfTarget = jsonSchema.findIndex(
            (item) => item.key === destinationData.key
          )
          if (indexOfTarget < 0) {
            console.warn("not found target from jsonSchema")
            return
          }

          const closestEdgeOfTarget = extractClosestEdge(destinationData)

          reorderItem({
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
          })
        }
      },
    })
  }, [jsonSchema, reorderItem])

  console.log(jsonSchema)

  return (
    <>
      <div className="h-[50px] text-xl font-bold text-center flex items-center justify-center">
        LowCode
      </div>
      <div className="flex flex-row h-[calc(100vh-50px)]">
        {/* 物料区 */}
        <div className="flex flex-col h-full bg-gray-100 w-[200px] gap-[10px]">
          <Draggable
            key="A"
            id="A"
            data={{ key: "A", color: "bg-red-500", isSource: true }}
          >
            <Box className="bg-red-500" />
          </Draggable>

          <Draggable
            key="draggable"
            id="draggable"
            data={{ key: "draggable", color: "bg-blue-500", isSource: true }}
          >
            <Box className="bg-blue-500" />
          </Draggable>
        </div>

        {/* 画布区 */}
        <div className="flex-1 h-full bg-green-100">
          <Droppable
            className="w-full h-full"
            key="droppable-root"
            id="droppable"
            data={{ key: "droppable-root" }}
          >
            {/* TODO: 容器组件 */}
            <div className="flex flex-col gap-[10px] w-full h-full">
              {jsonSchema.map((item) => (
                <Droppable key={item.key} id={item.key} data={item}>
                  <Draggable key={item.key} id={item.key} data={item}>
                    <Box key={item.key} className={item.color} />
                  </Draggable>
                </Droppable>
              ))}
            </div>
          </Droppable>
        </div>

        {/* 属性区 */}
        <div className="flex flex-col h-full bg-gray-100 w-[200px]"></div>
      </div>
    </>
  )
}

export default App
