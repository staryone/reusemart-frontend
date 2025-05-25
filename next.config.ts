import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "reusemart.e21593ef288257abc98dc47fe307980c.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
