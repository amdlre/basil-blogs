import type { ButtonProps } from '@/components/ui/button'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    role="navigation"
    {...props}
  />
)

const PaginationContent: React.FC<
  { ref?: React.Ref<HTMLUListElement> } & React.HTMLAttributes<HTMLUListElement>
> = ({ className, ref, ...props }) => (
  <ul className={cn('flex flex-row items-center gap-1', className)} ref={ref} {...props} />
)

const PaginationItem: React.FC<
  { ref?: React.Ref<HTMLLIElement> } & React.HTMLAttributes<HTMLLIElement>
> = ({ className, ref, ...props }) => <li className={cn('', className)} ref={ref} {...props} />

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'button'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        size,
        variant: isActive ? 'outline' : 'ghost',
      }),
      className,
    )}
    {...props}
  />
)

type DirectionLinkProps = React.ComponentProps<typeof PaginationLink> & {
  ariaLabel?: string
  label?: string
}

const PaginationPrevious = ({
  ariaLabel = 'Go to previous page',
  className,
  label = 'Previous',
  ...props
}: DirectionLinkProps) => (
  <PaginationLink
    aria-label={ariaLabel}
    className={cn('gap-1 ps-2.5', className)}
    size="default"
    {...props}
  >
    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
    <span>{label}</span>
  </PaginationLink>
)

const PaginationNext = ({
  ariaLabel = 'Go to next page',
  className,
  label = 'Next',
  ...props
}: DirectionLinkProps) => (
  <PaginationLink
    aria-label={ariaLabel}
    className={cn('gap-1 pe-2.5', className)}
    size="default"
    {...props}
  >
    <span>{label}</span>
    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
  </PaginationLink>
)

const PaginationEllipsis = ({
  className,
  label = 'More pages',
  ...props
}: React.ComponentProps<'span'> & { label?: string }) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">{label}</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
