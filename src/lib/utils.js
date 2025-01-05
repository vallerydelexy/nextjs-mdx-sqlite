import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { prisma } from "./prismaClient";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getPosts(page = 1, pageSize = 2) {
  const skip = (page - 1) * pageSize;
  const posts = await prisma.post.findMany({
    take: pageSize,
    skip,
  });

  const totalPosts = await prisma.post.count();
  return { posts, totalPosts };
}

export async function getPost(slug) {
  const post = await prisma.post.findUnique({
    where: { slug }
  });
  return post;
}


export async function getAllPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}