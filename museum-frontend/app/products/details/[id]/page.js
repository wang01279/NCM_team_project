'use client';
import React from 'react';
import CategoryMenu from '@/app/products/_components/CategoryMenu';
import ProductDetail from './_components/ProductDetail';
import ProductTabs from './_components/ProductTabs';
import ProductServiceTagline from './_components/ProductServiceTagline';
import YouMightLike from './_components/YouMightLike';

// 匯入你的假資料
import initialProductList from '@/app/datatest/productList';

// 假資料 (請替換成您的實際資料撈取邏輯)
const fakeProducts = [
  {
    id: 1,
    title: '青花纏枝天球瓶',
    subtitle: 'Underglaze blue porcelain globular vase with lotus-and-scrolls decor (detail) - 假資料 1',
    price: 9200,
    imageUrl: '/image/x.jpg',
    thumbnails: [
      '/image/x.jpg',
      '/image/c49.jpg',
      '/image/c50.jpg',
    ],
    stock: 5,
    description:
      '本作品為青花纏枝蓮紋天球瓶，燒製技術細緻，呈現柔潤的釉面與對稱的構圖。瓶身以纏枝蓮紋為主題，象徵吉祥與綿延不絕之意，是傳統瓷器藝術中的經典樣式之一。',
    category: '陶瓷', // 假設有分類
  },
  {
    id: 2,
    title: '粉彩花鳥瓶',
    subtitle: 'Famille rose vase with flowers and birds - 假資料 2',
    price: 7800,
    imageUrl: '/image/c51.jpg',
    thumbnails: [
      '/image/c51.jpg',
      '/image/c52.jpg',
      '/image/c27.jpg',
    ],
    stock: 10,
    description:
      '這件粉彩花鳥瓶色彩柔美，繪工精細，展現了生動的花鳥圖案。粉彩瓷器以其豐富的色彩和精緻的紋飾而聞名，是清代瓷器中的重要品類。',
    category: '瓷器', // 假設有分類
  },
  // ... 你可以繼續添加更多的假資料到 fakeProducts 或 initialProductList
];

export default function IdPage({ params }) { // 取得 params
  const { id } =  params; // 從 params 取得 id
  const productId = parseInt(id, 10); // 將 id 轉為數字

  // 使用 fakeProducts 找到當前商品
  const product = fakeProducts.find(p => p.id === productId);

  if (!product) {
    return <div>找不到商品</div>;
  }

  // 根據當前商品的分類，從 initialProductList 中篩選出相關商品並隨機取最多 8 個
  const relatedProducts = initialProductList
    .filter(p => p.category === product.category && p.id !== String(productId)) // 篩選相同分類且非當前商品
    .sort(() => 0.5 - Math.random()) // 隨機排序
    .slice(0, 8); // 取前 8 個

  return (
    <>
      <CategoryMenu />
      <ProductDetail product={product} />
      <ProductTabs product={product} />
      <ProductServiceTagline />
      <YouMightLike products={relatedProducts} /> {/* 將相關商品資料傳遞給 YouMightLike */}
    </>
  );
}