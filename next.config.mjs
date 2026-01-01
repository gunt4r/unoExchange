// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Define the base Next.js configuration
/** @type {import('next').NextConfig} */
const baseConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

// Initialize the Next-Intl plugin
let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

// Conditionally enable bundle analysis
if (process.env.ANALYZE === 'true') {
  try {
    const { default: withBundleAnalyzer } = await import('@next/bundle-analyzer');
    configWithPlugins = withBundleAnalyzer({
      enabled: true,
    })(configWithPlugins);
  } catch {
    console.warn('Bundle analyzer not available, skipping...');
  }
}

export default configWithPlugins;
