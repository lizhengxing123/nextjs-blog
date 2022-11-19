/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2022-11-17 21:52:03
 */
import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import type Author from "../interfaces/author";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

const PostHeader = ({ title, coverImage, date, author }: Props) => {
  return (
    <div className="text-lg max-w-prose prose prose-dark mx-auto">
      <h1 className="text-xl font-black max-w-prose mx-auto block tracking-wide uppercase text-white">
        {title}
      </h1>
      <div className="mt-8 mb-6 text-xl text-gray-300 leading-8">
        {/* <DateFormatter dateString={date} /> */}
        {date}
      </div>
      <CoverImage title={title} src={coverImage} />
    </div>
  );
};

export default PostHeader;
