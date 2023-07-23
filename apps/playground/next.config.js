/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@substreams/core", "@substreams/react", "@substreams/mermaid"],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts"],
      ".jsx": [".jsx", ".tsx"],
    };

    return config;
  },
};

module.exports = nextConfig;
