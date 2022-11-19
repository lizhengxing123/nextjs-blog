/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2022-11-18 21:06:01
 */
import { remark } from "remark";
import html from "remark-html";
import codeblocks from "remark-code-blocks";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
