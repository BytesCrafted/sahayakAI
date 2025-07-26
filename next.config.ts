import type {NextConfig} from 'next';
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: './.env' });

// Added this comment to trigger a server reload and fix a chunk loading issue.
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default async () => nextConfig;
