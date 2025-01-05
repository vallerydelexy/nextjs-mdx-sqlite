import Skillset from "@/components/Skillset";
import Avatar from "@/components/Avatar";
import GeometricLottie from "@/components/GeometricLottie";
import Whatsapp from "@/components/Whatsapp";
import Slides from "@/components/Slides";

export default async function Home() {
  return (
    <div className="bg-gradient-to-l dark:from-stone-800 from-gray-200 dark:via-whatsapp-darkBrown via-fuchsia-200 dark:to-zinc-950 to-stone-100">
      <main className="pt-4 bg-gray-100/25 dark:bg-gray-900/25 overflow-hidden">
        <div className="md:mt-16 mx-auto max-w-7xl px-4">
          <div className="">
            <div className="text-center">
              <Avatar />
            </div>
            <h1 className="text-center text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-gray-900 dark:text-gray-50 xl:inline motion-opacity-in-[0%] motion-blur-in-[5px]">
                Rizki Aprita
              </span>
            </h1>
            <h2 className="text-center text-1xl tracking-tight font-extrabold sm:text-5xl md:text-4xl">
              <span className="block text-indigo-600 dark:text-indigo-300 xl:inline motion-opacity-in-[0%] motion-blur-in-[5px] motion-preset-confetti">
                Software Engineer
              </span>
            </h2>

            <Whatsapp />

            <GeometricLottie />
            <div id="skillset" className="pt-6 text-left"></div>
          </div>
        </div>
        <div
          className="px-4 md:px-6 my-4 py-4 flex flex-col justify-between"
          id="portfolio"
        >
          <div className="flex-grow-0 order-last sm:order-none">
            <Skillset />
          </div>
          <Slides />
        </div>
      </main>
    </div>
  );
}
