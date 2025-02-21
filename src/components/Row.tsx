import clsx from "clsx"
import { Edit } from "./common/Edit"

interface RowProps {
  className?: string
  children?: React.ReactNode
  data: any
  [key: string]: any
}

export const Row = ({ className, children, ...props }: RowProps) => {
  return (
    <Edit data={props.data} className="w-full">
      <div className={clsx("flex flex-row min-w-2.5 border", className)} {...props}>
        {children}
      </div>
    </Edit>
  )
}
