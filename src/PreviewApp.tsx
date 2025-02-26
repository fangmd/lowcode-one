import * as React from "react"
import { useState } from "react"
import { JSONSchema } from "./types"
import { useComponents } from "./hooks/useComponents"
import { PreviewItem } from "./preview/PreviewItem"

export const PreviewApp: React.FC = () => {
  const [jsonSchema, setJsonSchema] = useState<JSONSchema[]>([
    {
      id: "root",
      type: "Column",
      isGroup: true,
      children: [
        {
          color: "bg-red-500",
          id: "204e737a-47c7-4d76-8c32-b23f4691a978",
          type: "Column",
          isGroup: true,
          children: [
            {
              color: "bg-red-500",
              id: "d31a0dc2-a84c-47db-9750-0f7c5afcbfa8",
              type: "Box",
              isGroup: false,
              text: 99,
            },
            {
              color: "bg-red-500",
              id: "c740c8a9-55a9-4ee4-b6af-8456941dad59",
              type: "Box",
              isGroup: false,
              text: 23,
            },
            {
              color: "bg-red-500",
              id: "c45583f5-ff84-4f0e-9d46-58d9be748224",
              type: "Box",
              isGroup: false,
              text: 17,
            },
          ],
          text: 42,
          isOpen: true,
        },
        {
          color: "bg-red-500",
          id: "5b3e52b9-a0ee-40af-9b90-53b3f3634733",
          type: "Box",
          isGroup: false,
          text: 32,
        },
        {
          color: "bg-red-500",
          id: "8bb74b48-5091-4230-909d-8e6ff896fecf",
          type: "Box",
          isGroup: false,
          text: 16,
        },
        {
          color: "bg-red-500",
          id: "2b4e86e6-832d-4c80-82be-4ff03ed8e69f",
          type: "Box",
          isGroup: false,
          text: 69,
        },
        {
          color: "bg-red-500",
          id: "6ad62002-e55b-4ccb-ba0d-cbd61804e4b5",
          type: "Box",
          isGroup: false,
          text: 3,
        },
        { id: "box1", type: "Box", isGroup: false, color: "bg-red-500" },
      ],
      isOpen: true,
    },
  ]) // JSON Schema

  const { components } = useComponents()

  console.log("components", jsonSchema)

  return (
    <div>
      {jsonSchema &&
        jsonSchema.map((item) => {
          const Component = components.find(
            (c) => c.type === item.type
          )?.component

          if (!Component) return null

          return <PreviewItem key={item.id} type={item.type} data={item} />
        })}
    </div>
  )
}
