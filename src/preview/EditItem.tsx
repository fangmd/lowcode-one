import clsx from "clsx"
import { Edit } from "../components/common/Edit"
import { ComponentType } from "../hooks/useComponents"

interface EditCompProps {
  data: any
  type: string
}

export const EditComp = ({ data, type }: EditCompProps) => {
  const Component = ComponentType.find((c) => c.type === type)?.component

  console.log("Component", Component)

  if (!Component) return null

  return (
    <Edit data={data} className={clsx(data.isGroup && "w-full")}>
      {data.isGroup && <Component key={data.id} data={data} />}

      {!data.isGroup && (
        <Component key={data.id} data={data} />
      )}
    </Edit>
  )
}
