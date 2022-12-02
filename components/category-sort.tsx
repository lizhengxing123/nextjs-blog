/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 10:45:08
 * @LastEditTime: 2022-12-02 15:35:48
 */
import PostCategory from "../interfaces/postCategory";
import { MouseEvent, MouseEventHandler } from "react";

type Props = {
  activeCategory: string;
  postCategoryList: PostCategory[];
  setActiveCategory: Function;
};

const CategorySort = ({
  activeCategory,
  postCategoryList,
  setActiveCategory,
}: Props) => {
  // 改变分类
  const handleChangeCategory = (e: MouseEvent<HTMLDivElement>) => {
    sessionStorage.setItem("type", e.currentTarget.textContent);
    setActiveCategory(e.currentTarget.textContent);
  };

  return (
    <div className="flex flex-wrap">
      {postCategoryList.length
        ? postCategoryList.map((category) => {
            return (
              <div className="flex flex-wrap pt-2" key={category.name}>
                <div className="inline-flex items-center justify-center border border-transparent text-base font-medium rounded-md text-yellow-500">
                  {category.name}：
                </div>
                {category.children.length
                  ? category.children.map((child) => {
                      return (
                        <div
                          className={`cursor-pointer inline-flex items-center justify-center px-1 sm:px-4 py-1 border border-transparent text-base font-medium rounded-md mr-3   ${
                            activeCategory === child
                              ? "text-black bg-yellow-300 hover:bg-yellow-500"
                              : "text-yellow-600 bg-gray-800 hover:bg-gray-700"
                          }`}
                          key={child}
                          onClick={(e) => handleChangeCategory(e)}
                        >
                          {child}
                        </div>
                      );
                    })
                  : ""}
              </div>
            );
          })
        : ""}
    </div>
  );
};

export default CategorySort;
