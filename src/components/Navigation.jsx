"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "@/config/routes";
import { cn } from "@/lib/utils";


export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex">
      <div className="flex items-center gap-4 text-sm xl:gap-6 ">
        {route.mainNav?.map(
          (item) =>
            item.href && (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/80"
                )}
              >
                {item.title}
              </Link>
            )
        )}
        {route.blogNav?.map(
          (item) =>
            item.href && (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/80"
                )}
              >
                {item.title}
              </Link>
            )
        )}
        
      </div>
    </div>
  );
}
