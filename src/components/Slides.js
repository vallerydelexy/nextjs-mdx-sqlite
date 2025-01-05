'use client';
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { webProjects } from "@/utils/SliderData";
import PortofolioCard from "@/components/PortofolioCard";
import "@splidejs/react-splide/css";


export default function Slides() {
  return (
    <div className="flex-grow-1">
      <Splide
        aria-label="Websites & UI/UX"
        options={{
          perPage: 1,
          padding: { right: "4rem" },
          gap: "1em",
          arrows: false,
        }}
        className="max-w-screen-md mx-auto md:rounded-t-lg"
      >
        {webProjects.map((project, index) => {
          return (
            <SplideSlide key={index}>
              <PortofolioCard
                logo={project.logo}
                image={project.image}
                domain={project.domain}
                title={project.title}
                description={project.description}
                stacks={project.stacks}
                year={project.year}
              />
            </SplideSlide>
          );
        })}
      </Splide>
    </div>
  );
}
