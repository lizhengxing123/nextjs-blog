/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2023-01-16 15:18:33
 */

import Avatar from "./avatar";
import CategoryCard from "./category-card";
import { AUTHOR } from "../lib/constants";
import PostCategory from "../interfaces/postCategory";
import Link from "next/link";
import FamousRemark from "./famous-remark";

type Props = {
  postCategories: PostCategory[];
};

const Intro = ({ postCategories }: Props) => {
  return (
    <>
      <div className="bg-black">
        <div className="relative pb-32 bg-gray-200">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIQfjzs1hdVtNhKOKqmakeSPZnCuxTATj_ig&usqp=CAU"
              alt=""
            />
            <div
              className="absolute inset-0 bg-gray-800 mix-blend-multiply"
              aria-hidden="true"
            ></div>
          </div>
          <div className="relative max-w-7xl mx-auto pt-12 pb-24 px-4 sm:pb-32 sm:px-6 lg:px-8">
            <Avatar {...AUTHOR}></Avatar>
          </div>
        </div>
        <section
          className="-mt-32 max-w-7xl mx-auto relative z-10 pb-8 px-4 sm:px-6 lg:px-8"
          aria-labelledby="contact-heading"
        >
          <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8">
            {postCategories && postCategories.length
              ? postCategories.map((category) => (
                  <CategoryCard {...category} key={category.name} />
                ))
              : ""}
          </div>
        </section>
      </div>
      <div className="bg-black">
        <div className="max-w-7xl mx-auto text-center pt-4 pb-12 px-4 sm:px-6 lg:pb-16 lg:px-8">
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/list"
                className="inline-flex items-center justify-center px-4 sm:px-16 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow-300 hover:bg-yellow-500"
              >
                文章列表
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <FamousRemark /> */}
    </>
  );
};

export default Intro;
