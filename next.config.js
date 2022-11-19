/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-17 12:10:09
 * @LastEditTime: 2022-11-18 22:26:07
 */
module.exports = {
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
  images: {
    domains: ["upload.wikimedia.org"],
  },
};
