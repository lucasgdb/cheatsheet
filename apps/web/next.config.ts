import path from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
  transpilePackages: ['@cheatsheets/ui', '@cheatsheets/content'],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default config;
