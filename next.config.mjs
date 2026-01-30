/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.siliconflow.cn',
      },
    ],
  },
};

export default nextConfig;

