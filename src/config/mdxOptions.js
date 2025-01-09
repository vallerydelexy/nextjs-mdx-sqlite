import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import php from "highlight.js/lib/languages/php";
import sql from "highlight.js/lib/languages/sql";

const highlightOptions = {
  languages: {
    typescript,
    javascript,
    php,
    sql,
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
    rehypePlugins: [[rehypeHighlight, highlightOptions]],
  },
};
