import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs(path: string = "") {
  return fs.readdirSync(join(postsDirectory, path));
}
export function getPostTypes(path = postsDirectory) {
  const result = [
    { name: "Backend", children: ["Node", "Express", "Graphql"] },
    {
      name: "Blockchain",
      children: ["Solidity", "Ethers", "Hardhat", "Chainlink"],
    },
    { name: "Frontend", children: ["Javascript", "React", "Webpack"] },
  ];
  // const root = fs.readdirSync(path);
  // if (root.length) {
  //   for (const slug of root) {
  //     const stat = fs.statSync(join(postsDirectory, slug));
  //     if (stat.isDirectory()) {
  //       result.push({
  //         name: slug,
  //         children: fs.readdirSync(join(path, slug)),
  //       });
  //     }
  //   }
  // }
  return result;
}
export function getPostBySlug(
  slug: string,
  fields: string[] = [],
  path: string = ""
) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, path, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });
  return items;
}

export function getAllPosts(fields: string[] = [], path: string = "") {
  let slugs = getPostSlugs(path);
  slugs = slugs.filter((i) => i.endsWith(".md"));
  if (slugs.length) {
    const posts = slugs
      .map((slug) => getPostBySlug(slug, fields, path))
      // sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
  }
  return [];
}
