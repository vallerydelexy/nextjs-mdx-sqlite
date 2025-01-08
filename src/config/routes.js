import { Item } from "@radix-ui/react-dropdown-menu";

export const route = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Portfolio",
      href: "/#portfolio",
    },
  ],
  blogNav: [
    {
      title: "Blog",
      href: "/blog",
      items: [
        {
          title: "Mastering Relational Database Design",
          href: "/mastering-relational-database-design",
        },
        {
          title: "Essential CLI/TUI Tools for Developers",
          href: "/essential-cli-tui-tools-for-developers",
        },
      ],
    },
  ],
};
