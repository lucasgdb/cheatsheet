'use client';

import { Toast } from '@base-ui/react/toast';
import { useCallback, type ReactNode } from 'react';

function Toasts() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="pointer-events-auto w-max max-w-full rounded-[3px] bg-hi px-3.5 py-2 text-[12.5px] text-bg shadow-lg transition-all duration-200 [overflow-wrap:anywhere] data-ending-style:translate-y-3 data-ending-style:opacity-0 data-starting-style:translate-y-3 data-starting-style:opacity-0"
    >
      <Toast.Description />
    </Toast.Root>
  ));
}

/** Provides the copy toast. Render once near the root. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider timeout={1600} limit={1}>
      {children}
      <ToastsPortal />
    </Toast.Provider>
  );
}

function ToastsPortal() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="gutter pointer-events-none fixed inset-x-0 bottom-[calc(44px+env(safe-area-inset-bottom,0px))] z-[80] flex justify-center">
        <Toasts />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

/** Copies text to the clipboard and confirms with a toast. */
export function useCopy() {
  const manager = Toast.useToastManager();
  return useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        manager.add({ description: `Copied: ${text}` });
      } catch {
        manager.add({ description: `Select and copy: ${text}` });
      }
    },
    [manager],
  );
}
