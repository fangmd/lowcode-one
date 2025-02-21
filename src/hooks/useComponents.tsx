import { useState } from "react"
import { genUUID } from "../utils"
import { Column } from "../components/Column"
import { Row } from "../components/Row"
import { Box } from "../components/Box"

export const ComponentType = [
  {
    id: genUUID(),
    type: "Column",
    component: Column,
  },
  {
    id: genUUID(),
    type: "Row",
    component: Row,
  },
  {
    id: genUUID(),
    type: "Box",
    component: Box,
  },
]

export const useComponents = () => {
  const [components, setComponents] = useState(ComponentType)

  return {
    components,
    setComponents,
  }
}
