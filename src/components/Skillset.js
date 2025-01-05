"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/Badge";
import { useTheme } from "next-themes";
import Grain from "./Grain";
import Link from "next/link";
const techstack = [
  {
    name: "Programming Language",
    items: [
      "JavaScript",
      "TypeScript",
      "Go",
      "Java",
      "Kotlin",
      "PHP",
      "Dart",
      "Python",
      "C++",
      "Objective C",
      "Swift",
      "Lua",

    ],
  },
  {
    name: "Mobile",
    items: ["Android Native", "iOS Native", "Flutter", "React Native"],
  },
  {
    name: "Web Frontend",
    items: [
      "React / Next JS",
      "Vue / Nuxt JS",
      "Tailwind CSS",
      "Bootstrap CSS",
      "Wordpress",
      "Laravel Blade",
    ],
  },
  {
    name: "Backend Frameworks",
    items: ["Laravel", "Django", "Express JS", "Koa JS", "Go Fiber", "Spring Boot"],
  },
  {
    name: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", ],
  },
  {
    name: "Cloud",
    items: ["AWS", "Alibaba Cloud", "Google Cloud"],
  },
  {
    name: "Others",
    items: ["Git", "Docker", "Jenkins", "Gitlab CI", "Nginx", "Apache"],
  },
];

export default function Skillset() {
  const { resolvedTheme: mode } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative mx-auto bg-white dark:bg-gray-800 bg-opacity-25 dark:bg-opacity-75 backdrop-filter backdrop-blur-sm md:max-w-lg shadow overflow-hidden rounded">
      <Grain />
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          Technical Skills
        </h3>
        <img
          className="pt-4"
          src={mode === "light" ? "images/dns.svg" : "images/dns-outline.svg"}
          alt="DNS illustration"
        />
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-100">
              Open Source Contributor to
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link href="https://strapi.io/" className="hover:motion-preset-confetti">
                <img
                  className="h-24 w-24"
                  src={
                    mode === "light"
                      ? "strapi/SVG/Strapi.full.logo.dark.svg"
                      : "strapi/SVG/Strapi.full.logo.light.svg"
                  }
                  alt="strapi open source contributor"
                />
              </Link>
            </dd>
          </div>
          {/* Rest of the skills sections remain unchanged */}

          {techstack.map((section) => (
            <div
              key={section.name}
              className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-100">
                {section.name} ({section.items.length})
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-wrap">
                {section.items.map((item, index) => (
                  <Badge key={index} text={item} />
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
