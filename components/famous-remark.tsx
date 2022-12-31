import { FAMOUS_REMARK_TEXT } from "../lib/constants";

const FamousRemark = () => {
  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <h2 className="flex-1 text-center text-3xl text-gray-200 font-extrabold tracking-tight sm:text-4xl">
          {FAMOUS_REMARK_TEXT}
        </h2>
      </div>
    </div>
  );
};

export default FamousRemark;
