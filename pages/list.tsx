/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 15:39:22
 * @LastEditTime: 2023-06-13 10:44:45
 */
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
import ActiveCategory from "../interfaces/category";

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
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>({
    name: "Frontend",
    sonName: "React",
    grandsonName: "全部",
  });
  useEffect(() => {
    // 当运行到客户端获取
    let type = sessionStorage.getItem("type");
    if (type) {
      type = JSON.parse(type);
      setActiveCategory(type as unknown as ActiveCategory);
    }
  }, []);

  const [showPosts, setShowPosts] = useState<Post[]>([]);
  useEffect(() => {
    if (allPosts.length && activeCategory) {
      const posts = allPosts.filter((post) => post.type === activeCategory.sonName);
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
