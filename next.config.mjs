/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
        NEXT_PUBLIC_API_BASE_AUTHENTICATION: process.env.NEXT_PUBLIC_API_BASE_AUTHENTICATION,
      },
      output: 'standalone',
};

export default nextConfig;
