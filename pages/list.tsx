import { useEffect, useState } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import Container from "../components/container";
import Breadcrumb from "../components/breadcrumb";
import CategorySort from "../components/category-sort";
import PostCard from "../components/post-card";
import { getAllPosts, getPostTypes } from "../lib/api";
import { BLOG_TITLE } from "../lib/constants";
import Post from "../interfaces/post";
import PostCategory from "../interfaces/postCategory";
import BreadcrumbItem from "../interfaces/breadcrumb";

type Props = {
  allPosts: Post[];
  postCategories: PostCategory[];
};

const breadcrumbList: BreadcrumbItem[] = [
  {
    title: "home",
    href: "/",
  },
  {
    title: "文章列表",
    href: "/list/",
  },
];

const List = ({ allPosts, postCategories }: Props) => {
  const [activeCategory, setActiveCategory] = useState("");
  useEffect(() => {
    // 当运行到客户端获取
    const type = sessionStorage.getItem("type") || "React";
    setActiveCategory(type);
  }, []);

  const [showPosts, setShowPosts] = useState<Post[]>([]);
  useEffect(() => {
    if (allPosts.length) {
      const posts = allPosts.filter((post) => post.type === activeCategory);
      setShowPosts(posts);
    }
  }, [activeCategory]);
  return (
    <Layout>
      <Head>
        <title>{BLOG_TITLE}</title>
      </Head>
      <Container>
        <Breadcrumb breadcrumbList={breadcrumbList} />
        <div className="relative bg-gray-950 pt-8 pb-20 px-4 sm:px-6 lg:pt-12 lg:pb-28 lg:px-8">
          <div className="absolute inset-0">
            <div className="bg-black h-1/3 sm:h-2/3"></div>
          </div>
          <div className="relative max-w-7xl mx-auto">
            <CategorySort
              postCategoryList={postCategories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
              {showPosts.length
                ? showPosts.map((post) => {
                    return <PostCard post={post} key={post.title} />;
                  })
                : ""}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

// 获取文章
export const getStaticProps = async () => {
  const allPosts = getAllPosts(
    ["title", "date", "slug", "author", "coverImage", "excerpt", "type"],
    ""
  );
  // 种类
  const postCategories = getPostTypes();
  return {
    props: { allPosts, postCategories },
  };
};

export default List;
