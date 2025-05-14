'use client'

//import icon
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

//import component
import SelectCity from '../_components/Shipping'
import BuyerInfo from '../_components/BuyerInfo'
import Payment from '../_components/Payment'
import OrderSummary2 from '../_components/OrderSummary2'

//import style
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './checkout.scss'

export default function CartPage() {
  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* 購買流程 */}
            <div className="crumbs">
              <ul>
                <li>
                  <div>
                    <FaShoppingCart /> 購物車
                  </div>
                </li>
                <li>
                  <div className="active">
                    <MdOutlinePayment /> 付款資訊
                  </div>
                </li>
                <li>
                  <div>
                    <AiOutlineTruck /> 完成訂單
                  </div>
                </li>
              </ul>
            </div>

            {/* 訂單資訊Title */}
            <div>
              <h3 className="mb-4 py-3 myOrder">付款資訊</h3>
            </div>

            <div className="row">
              {/* 左側收件人資料 */}
              <div className="col-md-8 col-12">
                <form>
                  <div className="row g-3 mb-4">
                    {/* 購買人資訊 */}
                    <BuyerInfo />
                    <SelectCity />
                    <Payment />
                  </div>

                  <div className="col-12 d-flex justify-content-between mt-4">
                    <a href="/cart" className="btn btn-dark px-5">
                      回到上一步
                    </a>
                    <a
                      href="/checkout"
                      id="orderBtn"
                      className="btn px-5"
                      style={{ backgroundColor: '#7b2d12', color: 'white' }}
                    >
                      前往付款
                    </a>
                  </div>
                </form>
              </div>
              <OrderSummary2 />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
