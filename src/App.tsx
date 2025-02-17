import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Box } from "./components/Box"
import { Droppable } from "./components/common/Droppable"
import { Draggable } from "./components/common/Draggable"
import { useState } from "react"
import { genUUID } from "./utils"

function App() {
  const [jsonSchema, setJsonSchema] = useState<
    { key: string; color: string }[]
  >([{ key: "-", color: "bg-red-500" }]) // JSON Schema

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event)
    const { active, over } = event

    // && over.data.current?.accepts.includes(active.data.current?.type) // 如果有 type 筛选
    if (over) {
      // do stuff
      console.log("drop box to context")

      setJsonSchema((prev) => [
        ...prev,
        { ...active.data.current, key: genUUID() },
      ])
    }
  }

  console.log(jsonSchema)

  return (
    <>
      <div className="h-[50px] text-xl font-bold text-center flex items-center justify-center">
        LowCode
      </div>
      <div className="flex flex-row h-[calc(100vh-50px)]">
        <DndContext onDragEnd={handleDragEnd}>
          {/* 物料区 */}
          <div className="flex flex-col h-full bg-gray-100 w-[200px] gap-[10px]">
            <Draggable key="A" id="A" data={{ key: "A", color: "bg-red-500" }}>
              <Box className="bg-red-500" />
            </Draggable>

            <Draggable
              key="draggable"
              id="draggable"
              data={{ key: "draggable", color: "bg-blue-500" }}
            >
              <Box className="bg-blue-500" />
            </Draggable>
          </div>

          {/* 画布区 */}
          <div className="flex-1 h-full bg-green-100">
            <Droppable key="droppable" id="droppable">
              {jsonSchema.map((item) => (
                <Box key={item.key} className={item.color} />
              ))}
            </Droppable>
          </div>

          {/* 属性区 */}
          <div className="flex flex-col h-full bg-gray-100 w-[200px]"></div>
        </DndContext>
      </div>
    </>
  )
}

export default App
