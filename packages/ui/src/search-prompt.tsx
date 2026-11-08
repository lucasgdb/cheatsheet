import type { ComponentProps } from 'react';
import { cn } from './cn';

/** Search field styled as the sheet's command prompt. */
export function SearchPrompt({ label, className, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label
      className={cn(
        'flex min-h-10 flex-[1_1_320px] items-center rounded-[2px] border border-prompt-line bg-prompt px-3 text-prompt-fg',
        className,
      )}
    >
      <span className="mr-2 font-bold whitespace-nowrap text-prompt-label">{label}</span>
      <input
        type="search"
        autoComplete="off"
        spellCheck={false}
        className="min-w-0 flex-1 self-stretch bg-transparent text-sm text-prompt-fg max-sm:text-base outline-none placeholder:text-prompt-ph [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
    </label>
  );
}
