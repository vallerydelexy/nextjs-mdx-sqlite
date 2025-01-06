import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prismaClient";
import { cache } from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getPosts = cache(async (page = 1, pageSize = 2) => {
  const skip = (page - 1) * pageSize;

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      take: pageSize,
      skip,
      select: {
        id: true,
        title: true,
        slug: true,
        cover: true,
        description: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.post.count(),
  ]);

  return { posts, totalPosts };
});

export const getPost = cache(async (slug) => {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  return post;
});

export async function getAllPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}
