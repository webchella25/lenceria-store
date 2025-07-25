// src/components/ui/Badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/80",
        primary: "border-transparent bg-primary text-white hover:bg-primary/80",
        secondary: "border-transparent bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-secondary-700 border-secondary-300 hover:bg-secondary-50",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        new: "border-transparent bg-accent-100 text-primary hover:bg-accent-200",
        featured: "border-transparent bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary/80 hover:to-primary-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }