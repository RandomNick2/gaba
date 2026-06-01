import React from 'react'
import { IconButton } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'

const ShareButton = ({ shareUrl, shareTitle }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: window.location.origin + shareUrl,
        })
        console.log('Бөлісу сәтті болды!')
      } catch (error) {
        console.error('Бөлісу кезінде қате кетті:', error)
        // Пайдаланушыға қате туралы хабарлауға болады
      }
    } else {
      // navigator.share қолжетімді болмаса, басқа әдісті қолдануға болады
      // Мысалы, бөлісу сілтемесін көшіруді ұсыну
      alert(`Бөлісу мүмкін емес. Сілтеме: ${window.location.origin + shareUrl}`)
    }
  }

  return (
    <IconButton aria-label="share" onClick={handleShare}>
      <ShareIcon />
    </IconButton>
  )
}

export default ShareButton
