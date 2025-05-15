// cou-card.js
import Image from 'next/image'
export default function CouponCard({ coupon }) {
  return (
    <div
      className="card d-flex flex-row position-relative"
      style={{ borderRadius: '8px', overflow: 'hidden' }}
    >
      <div
        className="flex-shrink-0"
        style={{
          width: '25%',
          backgroundImage: `url("/images/coupon-1.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '150px',
        }}
      />
      <div className="p-3 flex-grow-1" style={{ width: '75%' }}>
        <div className="text-end text-muted small">
          <Image
            src="/images/logo-outline.png"
            alt="Logo"
            width={15}
            height={15}
            style={{ objectFit: 'contain' }}
            className="p-0 me-1"
          />
          {coupon.name}
        </div>
        <h3 className="text-danger fw-bold mb-1">
          {coupon.type === '現金'
            ? `NT$ ${coupon.discount}`
            : `${coupon.discount}% OFF`}
        </h3>
        <p className="mb-1 small text-dark">低消 NT$ {coupon.minSpend}</p>
        <p className="mb-4 small text-dark">期限：{coupon.endDate}</p>
        <button className="btn btn-sm btn-primary position-absolute bottom-0 end-0 m-3">
          領取
        </button>
      </div>
    </div>
  )
}
