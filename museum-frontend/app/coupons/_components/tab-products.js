// tab-products.js
import CouponCard from './cou-card'
import styles from '../_styles/coupon.module.scss'

export default function TabProducts({ coupons }) {
  return (
    <div className={`container my-4 ${styles.borderCustom}`}>
      <div className="d-flex justify-content-between align-items-center pt-3 px-3 mb-3">
        <h5>可領取張數：{coupons.length}</h5>
        <button className="btn btn-primary btn-sm">一鍵領取</button>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4 pb-4">
        {coupons.map((c) => (
          <div
            className="col d-flex justify-content-center align-items-center"
            key={c.id}
          >
            <CouponCard coupon={c} />
          </div>
        ))}
      </div>
    </div>
  )
}
