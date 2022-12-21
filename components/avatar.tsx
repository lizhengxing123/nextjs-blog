/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2022-12-17 11:16:16
 */
import Image from "next/image";

type Props = {
  name: string;
  picture: string;
  intro: string;
};

const Avatar = ({ name, picture, intro }: Props) => {
  return (
    <div className="flex items-start space-x-5">
      <div className="flex-shrink-0">
        <div className="relative">
          <Image
            src={picture}
            alt={`Cover Image for ${name}`}
            className="w-16 h-16 rounded-full mr-5"
            width={64}
            height={64}
          />
          <span
            className="absolute inset-0 shadow-inner rounded-full"
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div className="pt-1.5">
        <h1 className="text-3xl font-bold text-gray-100">{name}</h1>
        <p className="text-base font-medium text-gray-400">{intro}</p>
      </div>
    </div>
  );
};

export default Avatar;
