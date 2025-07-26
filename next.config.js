/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'app.memo.directory'
            }
          ],
          destination: '/app/:path*'
        }
      ]
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't2.gstatic.com'
      }
    ]
  },
  experimental: {
    reactCompiler: true
  }
};

export default config;
