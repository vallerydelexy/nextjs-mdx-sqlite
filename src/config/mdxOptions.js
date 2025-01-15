import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { visit } from "unist-util-visit";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import php from "highlight.js/lib/languages/php";
import sql from "highlight.js/lib/languages/sql";
import go from "highlight.js/lib/languages/go";
import yaml from "highlight.js/lib/languages/yaml";
import dockerfile from "highlight.js/lib/languages/dockerfile";

const highlightOptions = {
  languages: {
    typescript,
    javascript,
    php,
    sql,
    go,
    yaml,
    dockerfile,
  },
  aliases: {
    ts: "typescript",
    js: "javascript",
  },
  subset: false,
  ignoreMissing: true,
};

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [
      [rehypeHighlight, highlightOptions],
      () => (tree) => {
        visit(tree, "element", (node) => {
          if (/^h[1-6]$/.test(node.tagName)) {
            // Use the same ID generation logic as your TableOfContents
            const text = node.children?.[0]?.value || '';
            const cleanText = text
              .replace(/[*_`]/g, '')
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, '')
              .replace(/--+/g, '-');
            
            node.properties.id = cleanText;
          }
        });
      }
    ],
  },
};