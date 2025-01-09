import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

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
    rehypePlugins: [[rehypeHighlight, highlightOptions]],
  },
};
