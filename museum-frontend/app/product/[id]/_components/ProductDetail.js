'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '../_styles/ProductDetail.scss';
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton';

const ProductDetail = ({ product }) => {
  const [mainImageSrc, setMainImageSrc] = useState(null); // 初始化為 null
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      if (product.thumbnails && product.thumbnails.length > 0) {
        setMainImageSrc(product.thumbnails[currentThumbnailIndex]);
      } else if (product.imageUrl) {
        setMainImageSrc(product.imageUrl);
      } else {
        setMainImageSrc(null); // 沒有有效 URL 時設定為 null
      }
    } else {
      setMainImageSrc(null); // product 不存在時設定為 null
    }
  }, [currentThumbnailIndex, product?.imageUrl, product?.thumbnails, product]);

  const handlePrevClick = () => {
    if (product?.thumbnails && currentThumbnailIndex > 0) {
      setCurrentThumbnailIndex(currentThumbnailIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (product?.thumbnails && currentThumbnailIndex < product.thumbnails.length - 1) {
      setCurrentThumbnailIndex(currentThumbnailIndex + 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentThumbnailIndex(index);
  };

  const handleQuantityIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleToggleFavorite = (productId, isCurrentlyFavorite) => {
    // 在這裡處理收藏邏輯
    console.log(`Product ${productId} is now ${isCurrentlyFavorite ? 'a favorite' : 'not a favorite'}`);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="container py-4">
        <div className="product-page">
          <div className="product-left">
            <Image
              src={mainImageSrc}
              className="main-image"
              alt={product.title}
              width={400}
              height={400}
            />
            {product.thumbnails && product.thumbnails.length > 1 && (
              <div className="thumbnail-carousel-wrapper">
                <button className="thumb-prev" onClick={handlePrevClick}>
                  &lt;
                </button>
                <div className="thumbnail-fixed-view">
                  {product.thumbnails && product.thumbnails.map((thumbnailUrl, index) => (
                    thumbnailUrl && typeof thumbnailUrl === 'string' && ( // 檢查 thumbnailUrl 是否存在且為字串
                      <Image
                        key={index}
                        src={thumbnailUrl}
                        alt=""
                        width={60}
                        height={60}
                        className={index === currentThumbnailIndex ? 'active' : ''}
                        onClick={() => handleThumbnailClick(index)}
                      />
                    )
                  ))}
                </div>
                <button className="thumb-next" onClick={handleNextClick}>
                  &gt;
                </button>
              </div>
            )}
          </div>
          <div className="product-right">
            <h2 className="product-title">{product?.title}</h2>
            <p className="product-subtitle">{product?.subtitle}</p>
            <div className="product-price">NT${product?.price}</div>
            <div className="quantity-cart">
              <div className="quantity-control">
                <button className="qty-btn" onClick={handleQuantityDecrement}>
                  -
                </button>
                <input type="text" value={quantity} className="qty-input" readOnly />
                <button className="qty-btn" onClick={handleQuantityIncrement}>
                  +
                </button>
              </div>
              <button className="add-to-cart d-flex">加入購物車</button>
            </div>
            <div className="wishlist">
              <AddToFavoritesButton
                productId={product?.id}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={false}
              />
              加入心願清單
            </div>
            <div className="stock-info">剩餘數量：{product?.stock} 件</div>
            <hr />
            <div className="product-description">{product?.description}</div>
          </div>
        </div>
        {/* 手機版固定下方購物列 */}
        <div className="mobile-fixed-bar d-md-none">
          <div className="container d-flex justify-content-between align-items-center gap-2">
            <div className="quantity-control">
              <button className="qty-btn" onClick={handleQuantityDecrement}>
                -
              </button>
              <input type="text" value={quantity} className="qty-input" readOnly />
              <button className="qty-btn" onClick={handleQuantityIncrement}>
                +
              </button>
            </div>
            <button className="add-to-cart d-flex justify-content-center align-items-center flex-grow-1">
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;