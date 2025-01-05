import dynamic from "next/dynamic";
import { Fragment } from "react";

const NoSSR = (props) => <Fragment>{props.children}</Fragment>;

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
