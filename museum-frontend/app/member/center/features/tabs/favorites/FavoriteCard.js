// FavoriteCard.js
export default function FavoriteCard({ item, type }) {
  return (
    <div className="card">
      <img src={`/images/${item.image}`} />
      <div className="card-body">
        <h5>{item.name || item.title}</h5>
        <p>{type === 'product' && `價格：${item.price} 元`}</p>
        <p>{type === 'exhibition' && `展期：${item.startDate} ~ ${item.endDate}`}</p>
      </div>
    </div>
  )
}
