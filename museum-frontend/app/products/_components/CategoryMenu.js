"use client";
import React, { useEffect, useState } from 'react';
import '../_styles/categoryMenu.scss';

const categories = [
  { name: '熱銷精選' },
  {
    name: '典藏精品',
    sub: ['陶瓷', '迷你陶器'],
  },
  {
    name: '餐廚用品',
    sub: ['馬克杯', '保溫杯', '品茗茶具', '吸水杯墊', '碗盤'],
  },
  {
    name: '圖書影音',
    sub: ['電子書', '期刊', 'DVD'],
  },
  {
    name: '文創商品',
    sub: ['生活用品', '辦公用品', '擺飾'],
  },
];

const CategoryMenu = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // 使用 state 來儲存是否為行動裝置

  useEffect(() => {
    // 在客戶端掛載後執行
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 首次掛載時判斷
    handleResize();

    // 監聽視窗大小改變
    window.addEventListener('resize', handleResize);

    // 清理事件監聽器
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 空的依賴陣列，確保只在掛載和卸載時執行

  const handleClick = (index) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMobile && activeIndex !== null && !e.target.closest('.category-menu')) {
        setActiveIndex(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobile, activeIndex]);

  return (
    <div className="container py-4">
      <div className="category-menu">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`category-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(idx);
            }}
          >
            <span>{cat.name}</span>
            {cat.sub && (
              <div className="subcategory">
                {cat.sub.map((item) => (
                  <a key={item} href="#">{item}</a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;