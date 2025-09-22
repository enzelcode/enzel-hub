"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
}

interface TooltipTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface TooltipContentProps {
  side?: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
  className?: string
}

const TooltipProvider: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>
}

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <div className="relative inline-block group">{children}</div>
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ asChild, children }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement)
  }
  return <>{children}</>
}

const TooltipContent: React.FC<TooltipContentProps> = ({
  side = "top",
  children,
  className
}) => {
  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2"
  }

  return (
    <div
      className={cn(
        "absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
        "px-2 py-1 text-xs bg-foreground text-background rounded whitespace-nowrap",
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }