"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "border-zinc-800 bg-zinc-950 text-white",
          description: "text-zinc-400",
        },
      }}
    />
  );
}
