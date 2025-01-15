import {Children} from "react";
const cleanHeadingText = (text) => {
  return text
    .toString()
    .replace(/[*_`]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-") 
    .replace(/[^\w-]/g, "") 
    .replace(/--+/g, "-");
};

const HeadingWrapper = ({ level, children }) => {
  const textContent = Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "object" && "props" in child) {
        return child.props.children;
      }
      return "";
    })
    .join("");

  const id = cleanHeadingText(textContent);
  const Heading = `h${level}`;

  return <Heading id={id}>{children}</Heading>;
};

export const mdxComponents = {
  h1: (props) => <HeadingWrapper level={1} {...props} />,
  h2: (props) => <HeadingWrapper level={2} {...props} />,
  h3: (props) => <HeadingWrapper level={3} {...props} />,
  h4: (props) => <HeadingWrapper level={4} {...props} />,
  h5: (props) => <HeadingWrapper level={5} {...props} />,
  h6: (props) => <HeadingWrapper level={6} {...props} />,
};
