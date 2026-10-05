"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"

/**
 * One dialog that is the right shape for the screen — shadcn's "responsive
 * dialog" pattern, built from the shadcn Dialog and Drawer.
 *
 *   phone  (< md)   a bottom Drawer: slides up, grab handle, swipe down to close,
 *                   stops below the status bar, padded for the home bar
 *   md and up       the centred Dialog the app has always shown
 *
 * Use it exactly like Dialog: ResponsiveDialog > ResponsiveDialogContent >
 * Header / Title / Description / Footer. Which of the two renders is decided
 * once, at the root, and shared, so the parts can never mismatch.
 *
 * `ResponsiveDialogContent` takes the desktop panel's classes in `className`
 * (width, padding, radius), and the phone layout in `mobileClassName`.
 */

const ResponsiveDialogContext = React.createContext(false)

type RootProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * When false, tapping outside does not close it. For a step the person has to
   * finish, such as a payment result.
   */
  dismissible?: boolean
  children: React.ReactNode
}

function ResponsiveDialog({
  dismissible = true,
  onOpenChange,
  children,
  ...props
}: RootProps) {
  const isMobile = useIsMobile()

  return (
    <ResponsiveDialogContext.Provider value={isMobile}>
      {isMobile ? (
        <Drawer
          {...props}
          showSwipeHandle
          disablePointerDismissal={!dismissible}
          onOpenChange={(open) => onOpenChange?.(open)}
        >
          {children}
        </Drawer>
      ) : (
        <Dialog
          {...props}
          disablePointerDismissal={!dismissible}
          onOpenChange={(open) => onOpenChange?.(open)}
        >
          {children}
        </Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  )
}

function ResponsiveDialogContent({
  className,
  mobileClassName,
  children,
  showCloseButton = false,
  style,
}: {
  /** Desktop panel: width, padding, radius. */
  className?: string
  /** Phone body: layout and spacing of what is inside the drawer. */
  mobileClassName?: string
  children: React.ReactNode
  /** The X in the corner (desktop only; a drawer closes by swiping or its own button). */
  showCloseButton?: boolean
  style?: React.CSSProperties
}) {
  const isMobile = React.useContext(ResponsiveDialogContext)

  if (isMobile) {
    return (
      <DrawerContent style={style}>
        {/* The drawer clips its contents, so the body scrolls itself, and ends
            with room for the home bar. */}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
            mobileClassName
          )}
        >
          {children}
        </div>
      </DrawerContent>
    )
  }

  return (
    <DialogContent
      className={className}
      style={style}
      showCloseButton={showCloseButton}
    >
      {children}
    </DialogContent>
  )
}

function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-dialog-footer"
      className={cn("flex gap-2", className)}
      {...props}
    />
  )
}

function ResponsiveDialogTitle(
  props: React.ComponentProps<typeof DialogTitle>
) {
  const isMobile = React.useContext(ResponsiveDialogContext)
  return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />
}

function ResponsiveDialogDescription(
  props: React.ComponentProps<typeof DialogDescription>
) {
  const isMobile = React.useContext(ResponsiveDialogContext)
  return isMobile ? (
    <DrawerDescription {...props} />
  ) : (
    <DialogDescription {...props} />
  )
}

function ResponsiveDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  const isMobile = React.useContext(ResponsiveDialogContext)
  return isMobile ? <DrawerClose {...props} /> : <DialogClose {...props} />
}

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
}
