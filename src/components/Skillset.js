"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Grain from "./Grain";

const techstack = [
  {
    name: "Languages",
    emoji: "⌨️",
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
      "SQL",
      "Zoho Deluge",
    ],
  },
  {
    name: "Mobile",
    emoji: "📱",
    items: ["Android Native", "iOS Native", "Flutter", "React Native"],
  },
  {
    name: "Web Frontend",
    emoji: "🖥",
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
    name: "Backend",
    emoji: "⚙️",
    items: [
      "Laravel",
      "Django",
      "Express JS",
      "Koa JS",
      "Go Fiber",
      "Spring Boot",
    ],
  },
  {
    name: "Databases",
    emoji: "🗄",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite"],
  },
  {
    name: "Cloud",
    emoji: "☁️",
    items: ["AWS", "Alibaba Cloud", "Google Cloud"],
  },
  {
    name: "DevOps",
    emoji: "🔧",
    items: ["Git", "Docker", "Jenkins", "Gitlab CI", "Nginx"],
  },
];

const OSS = [
  {
    name: "Strapi",
    href: "https://strapi.io/",
    lightLogo: "strapi/SVG/Strapi.full.logo.dark.svg",
    darkLogo: "strapi/SVG/Strapi.full.logo.light.svg",
  },
  {
    name: "Inertia.js",
    href: "https://inertiajs.com/",
    lightLogo: "inertia-logo.dark.svg",
    darkLogo: "inertia-logo.light.svg",
  },
];

const totalTech = techstack.reduce((s, t) => s + t.items.length, 0);

export default function Skillset() {
  const { resolvedTheme: mode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="relative mx-auto max-w-2xl font-mono rounded-lg bg-white dark:bg-gray-900 overflow-hidden p-6 sm:p-8">
      <Grain />

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-orange-500 dark:text-orange-400 mb-1">
          Portfolio · Technical
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 leading-none">
          Tech-Stack
        </h2>
      </div>

      {/* Skill rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {techstack.map((section) => (
          <div
            key={section.name}
            className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 py-4"
          >
            {/* Label */}
            <div className="flex flex-col gap-0.5 pt-0.5">
              <span className="text-base">{section.emoji}</span>
              <span className="text-[10px] tracking-widest uppercase text-gray-400 dark:text-gray-500 font-medium">
                {section.name}
              </span>
              <span className="text-[10px] text-orange-500 dark:text-orange-400">
                {String(section.items.length).padStart(2, "0")}
              </span>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-1.5">
              {section.items.map((item, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:text-white dark:hover:border-orange-500 transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total count */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-800">
        <div className="flex-1 h-px bg-gradient-to-r from-orange-500 to-transparent" />
        <span className="text-2xl font-extrabold text-orange-500 dark:text-orange-400 tracking-tight">
          {totalTech}
        </span>
        <span className="text-[10px] tracking-widest uppercase text-gray-400 dark:text-gray-500">
          technologies
        </span>
      </div>

      {/* OSS */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-[10px] tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">
          Open Source Contributor
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          {OSS.map((o) => (
            <Link
              key={o.name}
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-colors inline-flex items-center"
            >
              <img
                src={mode === "light" ? o.lightLogo : o.darkLogo}
                alt={`${o.name} open source contributor`}
                className="h-7 w-auto"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
