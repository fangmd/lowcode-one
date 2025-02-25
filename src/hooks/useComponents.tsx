import { useState } from "react"
import { genUUID } from "../utils"
import { Column } from "../components/Column"
import { Row } from "../components/Row"
import { Box } from "../components/Box"

export const ComponentType = [
  {
    id: genUUID(),
    type: "Column",
    isGroup: true,
    component: Column,
    children: [],
  },
  {
    id: genUUID(),
    type: "Row",
    isGroup: true,
    component: Row,
    children: [],
  },
  {
    id: genUUID(),
    type: "Box",
    isGroup: false,
    component: Box,
  },
  {
    id: genUUID(),
    type: "Button",
    isGroup: false,
    component: "http://localhost:8080/dist/index.js",
  },
]

export const useComponents = () => {
  const [components, setComponents] = useState(ComponentType)

  return {
    components,
    setComponents,
  }
}
