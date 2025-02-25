import clsx from "clsx"
import { ComponentType } from "../hooks/useComponents"
import React, { useEffect, useState } from "react"

export const loadRemoteComponent = (url) => {
  return new Promise((resolve, reject) => {
    // 检查组件是否已加载
    if (window.MyReactComponent) {
      resolve(window.MyReactComponent)
      return
    }

    const script = document.createElement("script")
    script.src = url
    script.onload = () => {
      if (window.MyReactComponent) {
        resolve(window.MyReactComponent)
      } else {
        reject(new Error("组件库加载失败"))
      }
    }
    script.onerror = () => {
      reject(new Error("加载脚本出错"))
    }
    document.head.appendChild(script)
  })
}

interface ColumnProps {
  className?: string
  data: any
  [key: string]: any
}

// Component to load remote components from URL
const RemoteComponent = ({ url, data }: { url: string; data: any }) => {
  const Component = React.lazy(() => {
    return loadRemoteComponent(url).then((component: any) => {
      return {
        default: component.Button,
      }
    })
  })

  return (
    <React.Suspense fallback={<div>Loading component...</div>}>
      <Component data={data} label="123new" />
    </React.Suspense>
  )
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
