"use client";

import FrostedCard from "./FrostedCard";
import { Mail, MessageCircle, Send, Linkedin, ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 812 7676 3536",
    href: "https://wa.me/6281276763536",
    action: "Chat directly",
  },
  {
    icon: Send,
    label: "Telegram",
    value: "@rizkiaprita",
    href: "https://t.me/rizkiaprita",
    action: "Send message",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "in/rizkiaprita",
    href: "https://www.linkedin.com/in/rizkiaprita/",
    action: "Connect",
  },
  {
    icon: BookOpen,
    label: "Technical Articles",
    value: "aprita.web.id/blog",
    href: "/blog",
    action: "Read blog",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-12 lg:py-20 scroll-mt-24">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Let's Collaborate
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            Start a Conversation
          </h2>
          <p className="mt-3 text-base text-stone-600 dark:text-stone-300 max-w-xl">
            Whether you have a new platform to architect, an existing product to refine, or want to collaborate on engineering craft, my inbox is open.
          </p>
        </div>

        {/* Primary Contact Action Card (iOS 26 Liquid Glass) */}
        <FrostedCard className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Direct Communication
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50">
                Ready to build something lasting?
              </h3>
              <p className="text-sm md:text-base text-stone-600 dark:text-stone-300">
                Reach out on WhatsApp or email for project inquiries and availability.
              </p>
            </div>

            <a
              href="https://wa.me/6281276763536"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.7),0_8px_24px_-4px_rgba(245,158,11,0.4)] transition-all duration-300 active:scale-95 flex-shrink-0"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Message on WhatsApp</span>
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/60 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              const isExternal = ch.href.startsWith("http");
              const Component = isExternal ? "a" : Link;

              return (
                <Component
                  key={ch.label}
                  href={ch.href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="liquid-glass-pill flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/60 dark:hover:bg-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="liquid-glass-well flex h-9 w-9 items-center justify-center rounded-xl text-amber-600 dark:text-amber-400 border border-amber-500/30 dark:border-amber-400/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        {ch.label}
                      </p>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {ch.value}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-stone-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                    {ch.action}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Component>
              );
            })}
          </div>
        </FrostedCard>
      </div>
    </section>
  );
}
