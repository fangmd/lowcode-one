import { ComponentType } from "../hooks/useComponents"

interface PreviewItemProps {
  data: any
  type: string
}

export const PreviewItem = ({ data, type }: PreviewItemProps) => {
  const Component = ComponentType.find((c) => c.type === type)?.component

  if (!Component) return null


  return <Component key={data.id} data={data} mode="preview" />
}
