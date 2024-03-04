import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs(path: string = "") {
  return fs.readdirSync(join(postsDirectory, path));
}
export function getPostTypes(path = postsDirectory) {
  const result = [
    {
      name: "Backend",
      children: [
        {
          name: "Node",
          children: [],
        },
        // {
        //   name: "Express",
        //   children: [],
        // },
        {
          name: "Graphql",
          children: [],
        },
        {
          name: "Sql",
          children: [],
        },
        {
          name: "Linux",
          children: [],
        },
        {
          name: "Python",
          children: [],
        },
        {
          name: "Django",
          children: [],
        },
        // {
        //   name: "Go",
        //   children: [],
        // },
      ],
    },
    {
      name: "Blockchain",
      children: [
        {
          name: "Solidity",
          children: [],
        },
        // {
        //   name: "Ethers",
        //   children: [],
        // },
        // {
        //   name: "Hardhat",
        //   children: [],
        // },
        {
          name: "Chainlink",
          children: [],
        },
      ],
    },
    {
      name: "Frontend",
      children: [
        {
          name: "Javascript",
          children: [],
        },
        {
          name: "React",
          children: [],
        },
        {
          name: "Webpack",
          children: [],
        },
      ],
    },
    // {
    //   name: "Algorithm",
    //   children: [
    //     {
    //       name: "UsefulInformation",
    //       children: [],
    //     },
    //     {
    //       name: "DataStructure",
    //       children: [],
    //     },
    //     {
    //       name: "Algorithms",
    //       children: [],
    //     },
    //     {
    //       name: "Questions",
    //       children: [],
    //     },
    //   ],
    // },
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
