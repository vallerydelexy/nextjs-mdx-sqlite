import { Item } from "@radix-ui/react-dropdown-menu";
import blogPosts from "@/app/blog/posts.json";

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
      items: blogPosts.map((post) => ({title: post.title, href: `/${post.slug}`}))
    },
  ],
};
