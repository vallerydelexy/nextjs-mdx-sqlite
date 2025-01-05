import Lottie from "react-lottie";
import animationData from "@/components/lottie/cirlce.json";

export default function CircleLottie({h, w}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={h || 500} width={w || 500} style={{position: "absolute"}}/>;
}