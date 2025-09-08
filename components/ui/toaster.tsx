"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

interface ToasterProps {
  position?: ToastPosition;
}

const getPositionClasses = (position: ToastPosition) => {
  const baseClasses =
    "fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]";

  switch (position) {
    case "top-left":
      return `${baseClasses} top-0 left-0 flex-col-reverse`;
    case "top-right":
      return `${baseClasses} top-0 right-0 flex-col-reverse`;
    case "top-center":
      return `${baseClasses} top-0 left-1/2 -translate-x-1/2 transform flex-col-reverse`;
    case "bottom-left":
      return `${baseClasses} bottom-0 left-0 flex-col`;
    case "bottom-right":
      return `${baseClasses} bottom-0 right-0 flex-col`;
    case "bottom-center":
      return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 transform flex-col`;
    default:
      return `${baseClasses} bottom-0 right-0 flex-col`;
  }
};

export function Toaster({ position = "bottom-right" }: ToasterProps) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport className={getPositionClasses(position)} />
    </ToastProvider>
  );
}
