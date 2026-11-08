'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { cn } from './cn';

export type SegmentedOption = { value: string; label: string };

/** Single-choice control built on Base UI ToggleGroup. Always keeps one value selected. */
export function Segmented({
  label,
  value,
  options,
  onValueChange,
  className,
}: {
  label: string;
  value: string;
  options: SegmentedOption[];
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        const picked = next[0];
        if (picked) onValueChange(picked);
      }}
      className={cn('flex items-stretch border border-line text-xs', className)}
    >
      <span className="flex items-center px-2.5 whitespace-nowrap text-muted">{label}</span>
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          className="min-h-[38px] border-l border-line px-3 text-muted-2 hover:text-hi data-pressed:bg-ctl-on data-pressed:text-accent"
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
