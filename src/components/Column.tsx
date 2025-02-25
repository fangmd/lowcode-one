import clsx from "clsx"
import { ComponentType } from "../hooks/useComponents"
import { RemoteComponent } from "../preview/RemoteComponent"

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
          const componentInfo = ComponentType.find((c) => c.type === item.type)

          if (!componentInfo) return null

          const { component } = componentInfo

          // Check if component is a string (URL) or a React component
          if (typeof component === "string") {
            return <RemoteComponent key={item.id} url={component} data={item} />
          }

          // Regular component - use capitalized variable for JSX
          const Component = component
          return <Component key={item.id} data={item} />
        })}
    </div>
  )
}
