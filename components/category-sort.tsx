/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 10:45:08
 * @LastEditTime: 2023-06-13 10:51:41
 */
import PostCategory from "../interfaces/postCategory";
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
    // 第二层点击
    if (type === 2) {
      setActiveCategory({
        name: activeCategory.name,
        sonName: name,
        grandsonName: "全部",
      });
    }
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
                            activeCategory.sonName === child.name
                              ? "text-black bg-yellow-300 hover:bg-yellow-500"
                              : "text-yellow-600 bg-gray-800 hover:bg-gray-700"
                          }`}
                          key={child.name}
                          onClick={() => handleChangeCategory(2, child.name)}
                        >
                          {child.name}
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
