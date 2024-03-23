import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (<div className={cn("animate-pulse rounded-md bg-muted dark:bg-[rgba(50,50,50,1)]", className)} {...props} />);
}

export { Skeleton }
