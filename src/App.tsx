import { Draggable } from "./components/common/Draggable"
import { useCallback, useEffect, useState } from "react"
import { genUUID, mReorderItem, mInsertItem } from "./utils"
import { JSONSchema, SchemaItem } from "./types"
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { useComponents } from "./hooks/useComponents"

function App() {
  const [jsonSchema, setJsonSchema] = useState<JSONSchema[]>([
    {
      id: "root",
      type: "Column",
      isGroup: true,
      children: [
        {
          id: "box1",
          type: "Box",
          isGroup: false,
          color: "bg-red-500",
        },
      ],
    },
  ]) // JSON Schema
  const [activeItem, setActiveItem] = useState<SchemaItem | null>(null)
  const { components } = useComponents()

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
        // console.log("monitorForElements onDrag", { source })
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
          newItem.id = genUUID()
          newItem.text = Math.floor(Math.random() * 100) // box properties
          delete newItem.isSource
          setJsonSchema((prev) => {
            let prevSchema = JSON.parse(JSON.stringify(prev))

            prevSchema = mInsertItem(
              prevSchema,
              destinationData as any,
              newItem as any
            )

            return prevSchema
          })
          return
        }

        // 从画布区拖动到画布区，修改位置
        if (!destinationData.isSource) {
          setJsonSchema((prev) => {
            let prevSchema = JSON.parse(JSON.stringify(prev))

            prevSchema = mReorderItem(
              prevSchema,
              destinationData as any,
              newItem as any
            )

            return prevSchema
          })
        }
      },
    })
  }, [jsonSchema, reorderItem])

  console.log("jsonSchema", jsonSchema)

  return (
    <>
      <div className="h-[50px] text-xl font-bold text-center flex items-center justify-center">
        LowCode
      </div>
      <div className="flex flex-row h-[calc(100vh-50px)]">
        {/* 物料区 */}
        <div className="flex flex-col h-full bg-gray-100 w-[200px] gap-[10px]">
          {components &&
            components.map((component) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { component: Component, ...rest } = component
              return (
                <Draggable
                  key={component.id}
                  id={component.id}
                  data={{
                    color: "bg-red-500",
                    isSource: true,
                    ...rest,
                  }}
                >
                  <div className="size-[100px] bg-blue-500 flex items-center justify-center text-white font-bold uppercase">
                    {component.type}
                  </div>
                </Draggable>
              )
            })}
        </div>

        {/* 画布区 */}
        <div className="flex-1 h-full bg-green-100">
          {jsonSchema &&
            jsonSchema.map((item) => {
              const Component = components.find(
                (c) => c.type === item.type
              )?.component

              if (!Component) return null

              return <Component key={item.id} data={item} />
            })}
        </div>

        {/* 属性区 */}
        <div className="flex flex-col h-full bg-gray-100 w-[200px]"></div>
      </div>
    </>
  )
}

export default App
