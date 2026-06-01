import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'

const SaveButton = ({ postId }) => {
  const [isSaved, setIsSaved] = useState(false) // Нақты күйді API-ден алу керек

  const handleSave = () => {
    // API-ге сақтау туралы сұрау жіберу логикасы
    setIsSaved(!isSaved)
    console.log(`Post ${postId} saved: ${!isSaved}`)
  }

  return (
    <IconButton aria-label="save" onClick={handleSave}>
      {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  )
}

export default SaveButton
