import {
  openSourceProjects,
  techstack,
  totalTech,
} from "@/config/techstack";
import { webProjects } from "@/utils/ProjectsData";

const metrics = [
  { value: 7, label: "Years in the field", suffix: "+" },
  { value: webProjects.length, label: "Products shipped", suffix: "" },
  { value: totalTech, label: "Technologies used", suffix: "" },
  { value: openSourceProjects.length, label: "OSS uplinks", suffix: "" },
];

export default function SkillMatrix() {
  return (
    <div className="mt-14">
      <div
        data-cyber-stagger
        className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4"
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            data-cyber-item
            className="bg-[#070709]/80 px-4 py-5 sm:px-5"
          >
            <div className="flex items-baseline gap-1">
              <span
                className="cyber-mono text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl"
                data-cyber-count={metric.value}
              >
                {String(metric.value).padStart(2, "0")}
              </span>
              {metric.suffix ? (
                <span className="cyber-mono text-xs text-[#ff2d2d]">
                  {metric.suffix}
                </span>
              ) : null}
            </div>
            <p className="cyber-label mt-2 text-[10px]">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="cyber-panel mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d]" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            </span>
            <span className="cyber-mono text-[11px] tracking-[0.1em] text-zinc-400">
              root@aprita:~$ cat stack.json
            </span>
          </div>
          <span className="cyber-mono text-[10px] tracking-[0.16em] text-zinc-500">
            {totalTech} NODES / ONLINE
          </span>
        </div>

        <div
          data-cyber-stagger
          className="grid gap-px bg-white/10 md:grid-cols-2"
        >
          {techstack.map((section, index) => (
            <div
              key={section.name}
              data-cyber-item
              className="bg-[#070709]/85 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="cyber-label text-[#ff2d2d]">
                  {section.code}_{String(index + 1).padStart(2, "0")}
                </span>
                <span className="cyber-mono text-[10px] tracking-[0.16em] text-zinc-500">
                  {String(section.items.length).padStart(2, "0")} NODES
                </span>
              </div>
              <h3 className="mt-3 text-[15px] font-bold uppercase tracking-[0.1em] text-zinc-200">
                {section.name}
              </h3>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {section.items.map((item) => (
                  <span key={item} className="cyber-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div
            data-cyber-item
            className="flex flex-col justify-between gap-6 bg-[#070709]/85 p-5 sm:p-6 md:col-span-2 md:flex-row md:items-center"
          >
            <div>
              <span className="cyber-label text-[#ff2d2d]">OSS_UPLINK</span>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                Open source contributor. Signal boosted through community
                infrastructure.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {openSourceProjects.map((project) => (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 transition-colors duration-300 hover:border-[#ff2d2d]/50 hover:bg-[#ff2d2d]/5"
                >
                  <span className="cyber-mono text-xs uppercase tracking-[0.1em] text-zinc-300">
                    {project.name}
                  </span>
                  <span className="cyber-mono text-[11px] text-zinc-500 transition-colors group-hover:text-[#ff2d2d]">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
