/*
 * @Descripttion: 页面布局
 * @Author: lizhengxing
 * @Date: 2022-11-17 07:44:30
 * @LastEditTime: 2022-11-18 20:35:55
 */
import Footer from "./footer";
import Meta from "./meta";
type Props = {
  preview?: boolean;
  children: React.ReactNode;
};

const Layout = ({ preview, children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Meta />
      <div className="flex-1 bg-black">
        <main className="h-full">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
