import clsx from "clsx"
import { Edit } from "../components/common/Edit"
import { ComponentType } from "../hooks/useComponents"
import { RemoteComponent } from "./RemoteComponent"

interface EditCompProps {
  data: any
  type: string
}

export const EditComp = ({ data, type }: EditCompProps) => {
  const Component = ComponentType.find((c) => c.type === type)?.component

  if (!Component) return null

  // Handle remote components
  if (typeof Component === "string") {
    return (
      <Edit data={data} className={clsx(data.isGroup && "w-full")}>
        <RemoteComponent url={Component} data={data} />
      </Edit>
    )
  }

  return (
    <Edit data={data} className={clsx(data.isGroup && "w-full")}>
      <Component key={data.id} data={data} mode="edit" />
    </Edit>
  )
}
