"use client";
import {useState, useCallback, Fragment} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { route } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useMetaColor } from "@/lib/meta-color";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const { setMetaColor, metaColor } = useMetaColor();

  const onOpenChange = useCallback(
    (open) => {
      setOpen(open);
      setMetaColor(open ? "#09090b" : metaColor);
    },
    [setMetaColor, metaColor]
  );

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="!size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          id="mobile-navigation-content"
          className="max-h-[60svh] p-0"
          side={'top'}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription id="mobile-nav-description" className="sr-only">
            Navigation menu containing main navigation links and sidebar navigation sections
          </SheetDescription>
          <div 
            className="overflow-auto p-6"
            aria-describedby="mobile-nav-description"
            role="navigation"
          >
            <nav className="flex flex-col space-y-3" aria-label="Main navigation">
              {route.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  )
              )}
            </nav>
            <div className="flex flex-col space-y-2">
              {route.blogNav.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 pt-6">
                  <h4 className="font-medium" id={`section-${index}`}>{item.title}</h4>
                  {item?.items?.length && (
                    <nav 
                      className="flex flex-col space-y-3 ml-2"
                      aria-labelledby={`section-${index}`}
                    >
                      {item.items.map((item) => (
                        <Fragment key={item.href}>
                          {!item.disabled &&
                            (item.href ? (
                              <MobileLink
                                href={item.href}
                                onOpenChange={setOpen}
                                className="text-muted-foreground"
                              >
                                {item.title}
                                {item.label && (
                                  <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                    {item.label}
                                  </span>
                                )}
                              </MobileLink>
                            ) : (
                              item.title
                            ))}
                        </Fragment>
                      ))}
                    </nav>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MobileLink({ href, onOpenChange, className, children, ...props }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
}