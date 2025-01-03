
import withMDX from '@next/mdx';

const mdxConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    // Additional MDX configuration options if needed
  },
});

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  /* other config options here */
};

// Merge MDX configuration with the existing nextConfig
export default mdxConfig(nextConfig);
