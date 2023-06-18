/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "uploadthing.com",
      "lh3.googleusercontent.com",
      "api.dicebear.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
