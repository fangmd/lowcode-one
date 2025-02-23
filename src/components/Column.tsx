import clsx from "clsx"
import { ComponentType } from "../hooks/useComponents"

interface ColumnProps {
  className?: string
  data: any
  [key: string]: any
}

export const Column = ({ className, ...props }: ColumnProps) => {
  const { children } = props.data
  return (
    <div className={clsx("flex flex-col min-h-3 border", className)} {...props}>
      {children &&
        children.map((item) => {
          const Component = ComponentType.find(
            (c) => c.type === item.type
          )?.component

          if (!Component) return null

          return <Component key={item.id} data={item} />
        })}
    </div>
  )
}
