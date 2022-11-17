/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 10:45:08
 * @LastEditTime: 2022-11-17 19:12:34
 */
import Link from "next/link";
import Image from "next/image";
import PostCategory from "../interfaces/postCategory";

const CategoryCard = ({ children, name }: PostCategory) => {
  return (
    <div className="flex flex-col bg-black rounded-2xl shadow-xl">
      <div className="flex-1 relative pt-16 px-6 pb-8 md:px-8">
        <div className="absolute top-0 inline-block rounded-xl shadow-lg transform -translate-y-1/2">
          <Image
            src={`/assets/blog/category/${name}.jpeg`}
            alt={`Cover Image for ${name}`}
            className="w-16 h-16"
            width={64}
            height={64}
          />
        </div>
        <h3 className="text-xl font-medium text-gray-100">
          {name} Development
        </h3>
        <div className="mt-4 text-base text-gray-200">
          {children && children.length
            ? children.map((child) => {
                return (
                  <span key={child} className="underline mr-4 text-lg">
                    {child}
                  </span>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
