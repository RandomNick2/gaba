// src/utils/helpers.js

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0
  }
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  return totalRating / reviews.length
}

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/photos/default-tour.jpg' // Өзіңіздің әдепкі суретіңізді қойыңыз
  }
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  return `http://127.0.0.1:8000/storage/${imagePath}` // Нақты API storage URL-ін қолданыңыз
}
