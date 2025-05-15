import CouponCard from './cou-card'

export default function TabProducts({ coupons }) {
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>可領取張數：{coupons.length}</h5>
        <button className="btn btn-primary btn-sm">一鍵領取</button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {coupons.map((c) => (
          <div className="col" key={c.id}>
            <CouponCard coupon={c} />
          </div>
        ))}
      </div>
    </div>
  )
}
