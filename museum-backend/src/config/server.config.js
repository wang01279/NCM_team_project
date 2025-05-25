import "dotenv/config.js";

export const serverConfig = {
  ship711: {
    development: {
      callbackUrl: "http://localhost:3000/cart/checkout", // ✅ 加上 /cart
    },
    production: {
      callbackUrl: "https://xxxxx.vercel.app/cart/checkout", // ✅ 跟上面一致
    },
  },
};
