import clsx from "clsx"

interface BoxProps {
  className?: string
  data: any
  [key: string]: any
}

export const Box = ({ className, ...props }: BoxProps) => {
  return (
    <div
      className={clsx("w-[40px] h-[40px] ", className, props.data.color)}
      {...props}
    >
      {props.data.text || "null"}
    </div>
  )
}
