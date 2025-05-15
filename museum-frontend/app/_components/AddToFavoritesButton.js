import React, { useState, useEffect } from 'react'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'

const AddToFavoritesButton = ({
  productId,
  onAddToFavorites,
  onToggleFavorite,
  isFavorite: initialIsFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false)
  const handleToggle = onToggleFavorite || onAddToFavorites || (() => {}) // 提供空函數作為預設值

  useEffect(() => {
    setIsFavorite(initialIsFavorite || false)
  }, [initialIsFavorite])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (handleToggle) {
      handleToggle(productId, !isFavorite)
    }
  }

  return (
    <button className="btn-icon favorite-button " onClick={toggleFavorite}>
      {isFavorite ? <FaBookmark className="text-danger" /> : <FaRegBookmark />}
    </button>
  )
}

export default AddToFavoritesButton
