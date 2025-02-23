import * as React from "react"
import { useState } from "react"
import { JSONSchema } from "./types"
import { useComponents } from "./hooks/useComponents"
import { PreviewItem } from "./preview/PreviewItem"

export const PreviewApp: React.FC = () => {
  const [jsonSchema, setJsonSchema] = useState<JSONSchema[]>([
    {
      color: "bg-red-500",
      id: "d315dacc-d5e4-4e14-9c4c-21ac7125b286",
      type: "Box",
      isGroup: false,
      text: 61,
    },
    {
      id: "root",
      type: "Column",
      isGroup: true,
      children: [
        {
          color: "bg-red-500",
          id: "963b63cb-5712-45d9-84bc-c4f2503dea29",
          type: "Box",
          isGroup: false,
          text: 4,
        },
        {
          color: "bg-red-500",
          id: "f9960f47-cb5b-4ae6-89f4-a76df47a8ebc",
          type: "Box",
          isGroup: false,
          text: 49,
        },
        {
          color: "bg-red-500",
          id: "1164c8ee-5182-437a-94bd-a1ef41297d0f",
          type: "Box",
          isGroup: false,
          text: 57,
        },
        { id: "box1", type: "Box", isGroup: false, color: "bg-red-500" },
      ],
      isOpen: true,
    },
  ]) // JSON Schema

  const { components } = useComponents()

  return (
    <div>
      {jsonSchema &&
        jsonSchema.map((item) => {
          const Component = components.find(
            (c) => c.type === item.type
          )?.component

          if (!Component) return null

          return <PreviewItem type={item.type} data={item} />
        })}
    </div>
  )
}
