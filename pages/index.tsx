/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2022-12-02 15:36:16
 */
import Container from "../components/container";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getPostTypes } from "../lib/api";
import Head from "next/head";
import { BLOG_TITLE } from "../lib/constants";
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
