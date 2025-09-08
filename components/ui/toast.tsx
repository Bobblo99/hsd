"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
// Animation rules separat
const getAnimationClasses = (position: string) => {
  const animations = {
    "top-left": {
      enter:
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full",
      exit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full",
    },
    "top-right": {
      enter:
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
      exit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
    },
    "top-center": {
      enter:
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full",
      exit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full",
    },
    "bottom-left": {
      enter:
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full",
      exit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full",
    },
    "bottom-right": {
      enter:
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
      exit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
    },
    "bottom-center": {
      enter:
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full",
      exit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full",
    },
  };

  return animations[position as keyof typeof animations];
};

//variants
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-in-out p-4",
  {
    variants: {
      variant: {
        default: "border-gray-700 bg-gray-900 text-gray-100",
        destructive: "border-red-700 bg-red-900 text-red-100",
        success: "border-green-600 bg-green-900 text-green-100",
        warning: "border-yellow-600 bg-yellow-900 text-yellow-100",
        info: "border-blue-600 bg-blue-900 text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      position?:
        | "top-left"
        | "top-right"
        | "top-center"
        | "bottom-left"
        | "bottom-right"
        | "bottom-center";
    }
>(({ className, variant, position = "bottom-right", ...props }, ref) => {
  const animationClasses = getAnimationClasses(position);

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }),
        animationClasses.enter,
        animationClasses.exit,
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
