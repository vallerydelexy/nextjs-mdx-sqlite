import type { NextConfig } from "next";
import withMDX from '@next/mdx';

const mdxConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    // Additional MDX configuration options if needed
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  /* other config options here */
};

// Merge MDX configuration with the existing nextConfig
export default mdxConfig(nextConfig);
