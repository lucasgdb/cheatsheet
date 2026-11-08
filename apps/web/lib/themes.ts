/** Accent and status-bar colours per cheat sheet (mirrors the design system tokens). */
export const sheetThemes: Record<string, { accent: string; bar: string; barFg: string }> = {
  tmux: { accent: '#a8d38a', bar: '#a8d38a', barFg: '#0d1015' },
  kubectl: { accent: '#79a3ff', bar: '#326ce5', barFg: '#ffffff' },
  vim: { accent: '#4cc87a', bar: '#d5d9e0', barFg: '#0d1015' },
  docker: { accent: '#4fb3ff', bar: '#1d63ed', barFg: '#ffffff' },
  terraform: { accent: '#b29cff', bar: '#7b42bc', barFg: '#ffffff' },
};

export const defaultTheme = { accent: '#a8d38a', bar: '#a8d38a', barFg: '#0d1015' };

/** The shared terminal ground every sheet sits on. */
export const groundColor = '#0d1015';
