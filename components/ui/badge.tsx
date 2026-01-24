import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center border px-3 py-1 text-xs font-bold uppercase transition-all duration-120',
  {
    variants: {
      variant: {
        default: 'bg-white text-black border-[3px] border-black',
        secondary: 'bg-white text-black border-[3px] border-black',
        destructive: 'bg-red-600 text-white border-[3px] border-black',
        outline: 'bg-white text-black border-[3px] border-black',
        success: 'bg-white text-green-700 border-[3px] border-black',
        warning: 'bg-white text-amber-700 border-[3px] border-black',
        inactive: 'bg-white text-gray-500 border-[3px] border-black',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
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
