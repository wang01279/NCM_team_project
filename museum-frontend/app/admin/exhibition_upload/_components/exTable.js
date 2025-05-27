import React from 'react'

export default function ExTable({ exhibitions = [] }) {
  const getStatus = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now >= start && now <= end) return '展覽中'
    if (now > end) return '已結束'
    return '未開始'
  }

  const truncateText = (text, max = 30) => {
    return text?.length > max ? `${text.slice(0, max)}...` : text
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>圖片</th>
          <th>名稱</th>
          <th>簡介</th>
          <th>開始</th>
          <th>結束</th>
          <th>狀態</th>
        </tr>
      </thead>
      <tbody>
        {exhibitions.map((row) => (
          <tr key={row.id}>
            <td>
              <img
                src={`/images/${row.image}`}
                alt="展覽圖片"
                style={{
                  width: '120px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            </td>
            <td>{row.title}</td>
            <td>{truncateText(row.intro)}</td>
            <td>{row.startDate}</td>
            <td>{row.endDate}</td>
            <td>{getStatus(row.startDate, row.endDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
