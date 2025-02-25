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

// Component to load remote components from URL
export const RemoteComponent = ({ url, data }: { url: string; data: any }) => {
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
