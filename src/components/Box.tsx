import clsx from "clsx"

interface BoxProps {
  className?: string
}

export const Box = ({ className }: BoxProps) => {
  return <div className={clsx("w-[40px] h-[40px] ", className)}></div>
}
