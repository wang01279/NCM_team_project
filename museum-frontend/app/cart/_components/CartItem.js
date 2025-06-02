'use client'
import Image from 'next/image'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useCart } from '@/app/_context/CartContext'

export default function CartItem({
  id,
  type,
  image,
  name,
  price,
  quantity,
  onDelete,
}) {
  const { updateQuantity } = useCart()

  const subtotal = price * quantity
  // console.log('🛒 CartItem image:', image)
  return (
    <>
      <div className="d-none d-md-flex row border-bottom justify-content-between align-items-center py-3">
        {/* 商品圖片 */}
        <div
          className="flex-shrink-0 border border-dark"
          style={{ width: '80px', height: '80px', position: 'relative' }}
        >
          <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
        </div>

        {/* 商品資訊 */}
        <div className="col-8 col-md-3">
          <div>{name}</div>
          {/* <div className="mt-1">{`NT$${price.toLocaleString()}`}</div> */}
        </div>

        {/* 數量 */}
        <div className="col-6 col-md-3 mt-3 mt-md-0 p-0 text-md-center text-start">
          <div className="quantity-selector">
            <button
              className="btn decrease d-flex justify-content-center align-items-center"
              onClick={() => updateQuantity(id, type, quantity - 1)}
            >
              −
            </button>
            <span className="quantity">{quantity}</span>
            <button
              className="btn increase d-flex justify-content-center align-items-center"
              onClick={() => updateQuantity(id, type, quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* 小計 */}
        <div className="col-6 col-md-2 mt-3 mt-md-0 text-center">
          {`NT$${subtotal.toLocaleString()}`}
        </div>

        {/* 刪除按鈕 */}
        <div className="col-4 col-md-2 mt-3 mt-md-0 text-center">
          <button
            className="btn btn-link text-danger p-0"
            onClick={() => onDelete(id, type)}
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>

      {/*手機版*/}
      <div className="d-md-none row d-flex border-bottom justify-content-between align-items-center py-3 g-3 px-0">
        {/* 左側圖片 */}
        <div
          className="col-4"
          style={{
            width: '80px',
            height: '100px',
            position: 'relative',
          }}
        >
          <Image src={image} alt={name} fill style={{ objectFit: 'contain' }} />
        </div>

        {/* 右側資訊欄（高度一致、內容對齊） */}
        <div
          className="col-8  d-flex flex-column justify-content-between"
          style={{ height: '100px' }}
        >
          {/* 商品名稱 + 刪除 */}
          <div className="d-flex justify-content-between align-items-start">
            <div className="fw-bold" style={{ width: '80%' }}>
              {name}
            </div>
            <button
              className="btn btn-link text-danger p-0"
              onClick={() => onDelete(id, type)}
            >
              <FaRegTrashAlt />
            </button>
          </div>

          {/* 價格 */}
          <div className="">{`NT$${subtotal.toLocaleString()}`}</div>

          {/* 數量控制器：靠右、對齊底部 */}
          <div className="mt-auto">
            <div className="quantity-selector  align-items-center">
              <button
                className="btn btn-sm px-2"
                style={{ fontSize: '14px' }}
                onClick={() => updateQuantity(id, type, quantity - 1)}
              >
                −
              </button>
              <span className="mx-2">{quantity}</span>
              <button
                className="btn btn-sm px-2"
                style={{ fontSize: '14px' }}
                onClick={() => updateQuantity(id, type, quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
