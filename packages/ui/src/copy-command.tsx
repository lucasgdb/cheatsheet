'use client';

import type { ComponentProps } from 'react';
import { Command } from './command';
import { useCopy } from './toast';

/** A command that copies itself to the clipboard on click and confirms with a toast. */
export function CopyCommand(props: Omit<ComponentProps<typeof Command>, 'onClick'>) {
  const copy = useCopy();
  return <Command {...props} onClick={() => void copy(props.text)} aria-label={`Copy ${props.text}`} />;
}
