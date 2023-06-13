/*
 * @Descripttion: 三层分类
 * @Author: lizhengxing
 * @Date: 2022-11-17 10:45:08
 * @LastEditTime: 2023-06-13 10:49:35
 */
import PostCategory from "../interfaces/postCategory";
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import ActiveCategory from "../interfaces/category";

type Props = {
  activeCategory: ActiveCategory;
  postCategoryList: PostCategory[];
  setActiveCategory: Function;
};

const CategorySort = ({
  activeCategory,
  postCategoryList,
  setActiveCategory,
}: Props) => {
  // 改变分类
  const handleChangeCategory = (type, name) => {
    // 第一层点击
    if (type === 1) {
      const list =
        postCategoryList.find((item) => item.name === name) ||
        ({} as PostCategory);
      setActiveCategory({
        name: name,
        sonName: list.children[0].name,
        grandsonName: "全部",
      });
    }
    // 第二层点击
    if (type === 2) {
      setActiveCategory({
        name: activeCategory.name,
        sonName: name,
        grandsonName: "全部",
      });
    }
    // 第三层点击
    if (type === 3) {
      setActiveCategory({
        name: activeCategory.name,
        sonName: activeCategory.sonName,
        grandsonName: name,
      });
    }
  };
  // 第二层数据
  const [secondCategoryList, setSecondCategoryList] = useState([]);

  const getSecondCategoryList = () => {
    const item = postCategoryList.find(
      (item) => item.name === activeCategory.name
    );
    if (item) {
      setSecondCategoryList(item.children);
    } else {
      setSecondCategoryList([]);
    }
  };
  // 获取第三层数据
  const [thirdCategoryList, setThirdCategoryList] = useState([]);

  const getThirdCategoryList = () => {
    const item = secondCategoryList.find(
      (item) => item.name === activeCategory.sonName
    );
    const totalItem = {
      name: "全部",
      children: [],
    };
    if (item) {
      setThirdCategoryList([totalItem, ...item.children]);
    } else {
      setThirdCategoryList([totalItem]);
    }
  };

  useEffect(() => {
    getSecondCategoryList();
    getThirdCategoryList();
  }, [activeCategory, secondCategoryList]);

  return (
    <div className="">
      {/* 第一层 */}
      <div className="flex items-center py-1">
        {/* <p className="border border-transparent text-base font-medium rounded-md text-yellow-500 w-32 text-right">
          First Level：
        </p> */}
        <div>
          {postCategoryList.length
            ? postCategoryList.map((category) => {
                return (
                  <div
                    className={`cursor-pointer inline-flex items-center justify-center px-1 sm:px-4 py-1 border border-transparent text-base font-medium rounded-md mr-3   ${
                      activeCategory.name === category.name
                        ? "text-black bg-yellow-300 hover:bg-yellow-500"
                        : "text-yellow-600 bg-gray-800 hover:bg-gray-700"
                    }`}
                    key={category.name}
                    onClick={() => handleChangeCategory(1, category.name)}
                  >
                    {category.name}
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      {/* 第二层 */}
      <div className="flex items-center py-1">
        {/* <p className="border border-transparent text-base font-medium rounded-md text-yellow-500  w-32 text-right">
          Second Level：
        </p> */}
        <div>
          {secondCategoryList.length
            ? secondCategoryList.map((category) => {
                return (
                  <div
                    className={`cursor-pointer inline-flex items-center justify-center px-1 sm:px-4 py-1 border border-transparent text-base font-medium rounded-md mr-3   ${
                      activeCategory.sonName === category.name
                        ? "text-black bg-yellow-300 hover:bg-yellow-500"
                        : "text-yellow-600 bg-gray-800 hover:bg-gray-700"
                    }`}
                    key={category.name}
                    onClick={() => handleChangeCategory(2, category.name)}
                  >
                    {category.name}
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      {/* 第三层 */}
      <div className="flex items-center py-1">
        {/* <p className="border border-transparent text-base font-medium rounded-md text-yellow-500  w-32 text-right">
          Third Level：
        </p> */}
        <div>
          {thirdCategoryList.length
            ? thirdCategoryList.map((category) => {
                return (
                  <div
                    className={`cursor-pointer inline-flex items-center justify-center px-1 sm:px-4 py-1 border border-transparent text-base font-medium rounded-md mr-3   ${
                      activeCategory.grandsonName === category.name
                        ? "text-black bg-yellow-300 hover:bg-yellow-500"
                        : "text-yellow-600 bg-gray-800 hover:bg-gray-700"
                    }`}
                    key={category.name}
                    onClick={() => handleChangeCategory(3, category.name)}
                  >
                    {category.name}
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default CategorySort;
