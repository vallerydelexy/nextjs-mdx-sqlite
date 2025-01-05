import MobileNavigation from "@/components/MobileNavigation";
import { Navigation } from "@/components/Navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Icons } from "@/components/icons";
import Link from "next/link";
export function LayoutHeader() {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-6 w-full">
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 md:order-first order-2"
            >
              <Icons.logo className="h-6 w-6" />
            </Link>
            <Navigation />
            <div  className=" items-center gap-2" style={{display: "contents"}}>
                <MobileNavigation />

                <ModeToggle />

            </div>
          </div>
        </div>
      </header>
    );
  }