import Link from "next/link";
import DecodeText from "./DecodeText";

const channels = [
  {
    code: "WA",
    label: "WhatsApp",
    value: "+62 812 7676 3536",
    href: "https://wa.me/6281276763536",
    external: true,
  },
  {
    code: "TG",
    label: "Telegram",
    value: "@rizkiaprita",
    href: "https://t.me/rizkiaprita",
    external: true,
  },
  {
    code: "LI",
    label: "LinkedIn",
    value: "in/rizkiaprita",
    href: "https://www.linkedin.com/in/rizkiaprita/",
    external: true,
  },
  {
    code: "BL",
    label: "Archive Log",
    value: "aprita.web.id/blog",
    href: "/blog",
    external: false,
  },
];

export default function ContactUplink() {
  return (
    <div className="flex w-full flex-col justify-between">
      <div>
        <a
          href="https://wa.me/6281276763536"
          target="_blank"
          rel="noreferrer"
          className="group relative flex flex-col justify-between gap-6 overflow-hidden border border-white/10 bg-white/[0.02] p-6 transition-colors duration-500 hover:border-[#ff2d2d]/50 sm:flex-row sm:items-center sm:p-8"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[#ff2d2d]/10 transition-transform duration-700 ease-out group-hover:translate-x-0" />
          <span className="relative">
            <span className="cyber-label text-[#ff2d2d]">PRIMARY CHANNEL</span>
            <span className="mt-2 block text-2xl font-black uppercase tracking-tight text-zinc-100 sm:text-4xl">
              Start a transmission
            </span>
            <span className="cyber-mono mt-2 block text-[11px] uppercase tracking-[0.16em] text-zinc-400">
              Encrypted / direct / no brief required
            </span>
          </span>
          <span className="relative flex items-center gap-3">
            <span className="cyber-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
              OPEN UPLINK
            </span>
            <span className="flex h-11 w-11 items-center justify-center border border-white/15 text-lg text-zinc-300 transition-all duration-500 group-hover:border-[#ff2d2d] group-hover:bg-[#ff2d2d] group-hover:text-black">
              ↗
            </span>
          </span>
        </a>

        <div className="mt-px grid grid-cols-1 gap-px border-x border-b border-white/10 bg-white/10 sm:grid-cols-2">
          {channels.map((channel) => {
            const content = (
              <>
                <span className="flex items-center gap-3">
                  <span className="cyber-mono text-[10px] tracking-[0.16em] text-[#ff2d2d]">
                    {channel.code}
                  </span>
                  <span className="cyber-mono text-xs uppercase tracking-[0.1em] text-zinc-200">
                    {channel.label}
                  </span>
                </span>
                <span className="cyber-mono flex items-center gap-3 text-xs text-zinc-400">
                  {channel.value}
                  <span className="text-zinc-500 transition-colors duration-300 group-hover:text-[#ff2d2d]">
                    ↗
                  </span>
                </span>
              </>
            );

            const className =
              "group flex items-center justify-between gap-4 bg-[#070709]/85 px-5 py-4 transition-colors duration-300 hover:bg-[#0b0b0e]";

            return channel.external ? (
              <a
                key={channel.code}
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={channel.code} href={channel.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
          <span className="cyber-mono text-[10px] tracking-[0.16em] text-zinc-500">
            <DecodeText>ALL SYSTEMS NOMINAL</DecodeText>
          </span>
          <span className="cyber-mono text-[10px] tracking-[0.16em] text-zinc-500">
            07°15&apos;S / 112°45&apos;E — SURABAYA, ID
          </span>
          <span className="cyber-mono text-[10px] tracking-[0.16em] text-zinc-500">
            SYS v2.6
          </span>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="cyber-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
          © {new Date().getFullYear()} Rizki Aprita
        </p>
        <p className="cyber-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
          Designed &amp; engineered in Surabaya
        </p>
        <a
          href="#top"
          className="cyber-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-[#ff2d2d]"
        >
          Return to origin ↑
        </a>
      </div>
    </div>
  );
}
