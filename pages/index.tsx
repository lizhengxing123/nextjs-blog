/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2022-11-17 19:35:01
 */
import Container from "../components/container";
import Intro from "../components/intro";
import Subscribe from "../components/subscribe";
import Layout from "../components/layout";
import { getPostTypes } from "../lib/api";
import Head from "next/head";
import { BLOG_TITLE, CMS_NAME } from "../lib/constants";
import Post from "../interfaces/post";
import PostCategory from "../interfaces/postCategory";

type Props = {
  postCategories: PostCategory[];
};

export default function Index({ postCategories }: Props) {
  return (
    <>
      <Layout>
        <Head>
          <title>{BLOG_TITLE}</title>
        </Head>
        <Container>
          <Intro postCategories={postCategories} />
          {/* <Subscribe /> */}
          {/* {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        </Container>
      </Layout>
    </>
  );
}
// 获取文章
export const getStaticProps = async () => {
  // 种类
  const postCategories = getPostTypes();
  return {
    props: { postCategories },
  };
};
