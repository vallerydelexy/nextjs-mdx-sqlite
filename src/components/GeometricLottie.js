// "use client";
// import dynamic from "next/dynamic";
// import animationData from "@/components/lottie/geometric.json";
// import CircleAnimation from "@/components/lottie/circle.json";

// const Lottie = dynamic(() => import("react-lottie-player"), {
//   ssr: false,
// });

// export default function GeometricLottie() {
//   return (
//     <div>
//       <Lottie
//         animationData={animationData}
//         style={{ position: "absolute", top: "90%", left: "50%" }}
//         speed={1}
//         loop
//         play
//       />
//       <Lottie
//         animationData={CircleAnimation}
//         style={{ position: "absolute", bottom: "-90%", right: "40%" }}
//         speed={1}
//         loop
//         play
//       />
//     </div>
//   );
// }

"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

async function loadGeometric() {
  const data = await import("@/components/lottie/geometric.json");
  return data.default;
}

async function loadCircle() {
  const data = await import("@/components/lottie/circle.json");
  return data.default;
}

export default function GeometricLottie() {
  const [animationData, setAnimationData] = useState(null);
  const [circleAnimation, setCircleAnimation] = useState(null);

  useEffect(() => {
    loadGeometric().then(setAnimationData);
    loadCircle().then(setCircleAnimation);
  }, []);

  return (
    <div>
      {animationData && (
        <Lottie
          animationData={animationData}
          style={{ position: "absolute", top: "90%", left: "50%" }}
          speed={1}
          loop
          play
        />
      )}
      {circleAnimation && (
        <Lottie
          animationData={circleAnimation}
          style={{ position: "absolute", bottom: "-90%", right: "40%" }}
          speed={1}
          loop
          play
        />
      )}
    </div>
  );
}
