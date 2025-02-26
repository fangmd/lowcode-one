import clsx from "clsx"
import { ComponentType } from "../hooks/useComponents"
import { RemoteComponent } from "../preview/RemoteComponent"
import { EditComp } from "../preview/EditItem"
import { memo } from "react"

interface ColumnProps {
  className?: string
  data: any
  mode?: "edit" | "preview"
  [key: string]: any
}

export const Column = memo(
  ({ className, mode = "preview", ...props }: ColumnProps) => {
    const { children } = props.data

    // Base container element
    const containerElement = (
      <div
        className={clsx("flex flex-col min-h-3 border", className)}
        {...props}
      >
        {children && children.map((item) => renderChild(item, mode))}
      </div>
    )

    return containerElement
  }
)

// Helper function to render child components based on mode
function renderChild(item: any, mode: "edit" | "preview") {
  const componentInfo = ComponentType.find((c) => c.type === item.type)

  if (!componentInfo) return null

  const { component } = componentInfo

  // For edit mode, use EditComp to wrap the component
  if (mode === "edit") {
    return <EditComp key={item.id} type={item.type} data={item} />
  }

  // Handle remote components
  if (typeof component === "string") {
    return <RemoteComponent key={item.id} url={component} data={item} />
  }

  // For preview mode, directly render the component
  const Component = component
  return <Component key={item.id} data={item} />
}
