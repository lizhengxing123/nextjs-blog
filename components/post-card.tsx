/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 17:39:39
 * @LastEditTime: 2022-12-02 15:35:55
 */
import Link from "next/link";
import Post from "../interfaces/post";

type Props = {
  post: Post;
};
const PostCard = ({ post }: Props) => {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <img
          className="h-48 w-full object-cover"
          src={post.coverImage}
          alt="Infinite Games"
        />
      </div>
      <div className="flex-1 bg-gray-900 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link
            as={`/posts/${post.slug}`}
            href="/posts/[slug]"
            aria-label={post.title}
            className="block mt-2"
          >
            <p className="text-xl font-semibold text-gray-100">{post.title}</p>
            <p className="mt-3 text-base text-gray-500">
              {/* <DateFormatter dateString={post.date} /> */}
              {post.date}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
